"use server";

import { hash } from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { signIn } from "@/auth";

export async function registerUser(formData: FormData) {
  const firstName = formData.get("firstName") as string;
  const lastName = formData.get("lastName") as string;
  const email = (formData.get("email") as string).toLowerCase().trim();
  const phone = formData.get("phone") as string;
  const password = formData.get("password") as string;

  if (!firstName || !lastName || !email || !phone || !password) {
    return { error: "all_fields_required" };
  }

  if (password.length < 8) {
    return { error: "password_too_short" };
  }

  // Check if email already exists
  const existing = await prisma.customerAccount.findUnique({
    where: { email },
  });

  if (existing) {
    return { error: "email_exists" };
  }

  const passwordHash = await hash(password, 12);

  // Create Client + CustomerAccount
  const client = await prisma.client.create({
    data: { firstName, lastName, phone, email },
  });

  await prisma.customerAccount.create({
    data: { email, passwordHash, clientId: client.id },
  });

  // Auto sign-in after registration
  await signIn("credentials", {
    email,
    password,
    redirect: false,
  });

  return { success: true };
}

export async function loginWithCredentials(formData: FormData) {
  const email = (formData.get("email") as string).toLowerCase().trim();
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "all_fields_required" };
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
