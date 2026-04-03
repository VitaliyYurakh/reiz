import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session?.user?.clientId) {
    return NextResponse.json(null, { status: 401 });
  }

  const client = await prisma.client.findUnique({
    where: { id: session.user.clientId },
    select: {
      firstName: true,
      lastName: true,
      phone: true,
      email: true,
      city: true,
      country: true,
    },
  });

  return NextResponse.json(client);
}
