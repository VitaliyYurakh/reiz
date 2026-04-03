import { NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const { firstName, lastName, email, phone, password } = await req.json();

  if (!firstName || !lastName || !email || !phone || !password) {
    return NextResponse.json({ error: "all_fields_required" }, { status: 400 });
  }

  if (password.length < 8) {
    return NextResponse.json({ error: "password_too_short" }, { status: 400 });
  }

  const existing = await prisma.customerAccount.findUnique({
    where: { email: email.toLowerCase().trim() },
  });

  if (existing) {
    return NextResponse.json({ error: "email_exists" }, { status: 409 });
  }

  const passwordHash = await hash(password, 12);

  const client = await prisma.client.create({
    data: {
      firstName,
      lastName,
      phone,
      email: email.toLowerCase().trim(),
    },
  });

  await prisma.customerAccount.create({
    data: {
      email: email.toLowerCase().trim(),
      passwordHash,
      clientId: client.id,
    },
  });

  return NextResponse.json({ success: true });
}
