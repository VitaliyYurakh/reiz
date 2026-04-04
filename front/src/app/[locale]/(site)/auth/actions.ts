"use server";

import { hash } from "bcryptjs";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import { signIn } from "@/auth";
import { rateLimit } from "@/lib/rate-limit";
import { verifyTurnstileToken } from "@/lib/turnstile";

/** Strip HTML tags and trim whitespace */
function sanitize(value: string): string {
  return value.replace(/<[^>]*>/g, "").trim();
}

const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

export async function registerUser(formData: FormData) {
  // --- Rate limiting (5 registrations per IP per hour) ---
  const headersList = await headers();
  const ip =
    headersList.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    headersList.get("x-real-ip") ||
    "unknown";

  const { success: withinLimit } = rateLimit(`register:${ip}`, {
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 5,
  });

  if (!withinLimit) {
    return { error: "too_many_requests" };
  }

  // --- Honeypot check (bot trap) ---
  const honeypot = formData.get("website") as string;
  if (honeypot) {
    // Bots fill hidden fields — silently reject
    return { success: true };
  }

  // --- CAPTCHA verification ---
  const turnstileToken = formData.get("cf-turnstile-response") as string;
  if (!turnstileToken) {
    return { error: "captcha_required" };
  }

  const captchaValid = await verifyTurnstileToken(turnstileToken);
  if (!captchaValid) {
    return { error: "captcha_failed" };
  }

  // --- Extract and sanitize input ---
  const firstName = sanitize(formData.get("firstName") as string || "");
  const lastName = sanitize(formData.get("lastName") as string || "");
  const email = (formData.get("email") as string || "").toLowerCase().trim();
  const phone = sanitize(formData.get("phone") as string || "");
  const password = formData.get("password") as string;
  const consent = formData.get("consent");

  // --- Validation ---
  if (!firstName || !lastName || !email || !phone || !password) {
    return { error: "all_fields_required" };
  }

  if (!consent) {
    return { error: "consent_required" };
  }

  if (!PASSWORD_REGEX.test(password)) {
    return { error: "password_too_weak" };
  }

  // --- Check for existing email (generic error to prevent enumeration) ---
  const existing = await prisma.customerAccount.findUnique({
    where: { email },
  });

  if (existing) {
    return { error: "registration_failed" };
  }

  // --- Create account ---
  const passwordHash = await hash(password, 12);

  const client = await prisma.client.create({
    data: { firstName, lastName, phone, email },
  });

  await prisma.customerAccount.create({
    data: { email, passwordHash, clientId: client.id },
  });

  // Auto sign-in after registration
  try {
    await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
  } catch {
    // Account created but auto-login failed — user can login manually
  }

  return { success: true };
}

export async function loginWithCredentials(formData: FormData) {
  const email = (formData.get("email") as string || "").toLowerCase().trim();
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "all_fields_required" };
  }

  // --- Rate limiting (10 login attempts per IP per 15 min) ---
  const headersList = await headers();
  const ip =
    headersList.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    headersList.get("x-real-ip") ||
    "unknown";

  const { success: withinLimit } = rateLimit(`login:${ip}`, {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10,
  });

  if (!withinLimit) {
    return { error: "too_many_requests" };
  }

  // --- CAPTCHA verification ---
  const turnstileToken = formData.get("cf-turnstile-response") as string;
  if (!turnstileToken) {
    return { error: "captcha_required" };
  }

  const captchaValid = await verifyTurnstileToken(turnstileToken);
  if (!captchaValid) {
    return { error: "captcha_failed" };
  }

  // --- Account lockout check (per email) ---
  const { success: emailNotLocked } = rateLimit(`login-email:${email}`, {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5,
  });

  if (!emailNotLocked) {
    return { error: "account_locked" };
  }

  try {
    await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    return { success: true };
  } catch {
    return { error: "invalid_credentials" };
  }
}
