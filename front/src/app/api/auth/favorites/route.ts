import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getFavorites } from "@/lib/api/customer";

export async function GET() {
  const session = await auth();
  if (!session?.user?.clientId) {
    return NextResponse.json(null, {
      status: 401,
      headers: { "Cache-Control": "private, no-store" },
    });
  }

  const favorites = await getFavorites();
  const favoriteIds = favorites
    .map((favorite: { car?: { id?: number | null } | null; carId?: number | null }) =>
      favorite.car?.id ?? favorite.carId,
    )
    .filter((id: unknown): id is number => typeof id === "number");

  return NextResponse.json(
    { favoriteIds },
    { headers: { "Cache-Control": "private, no-store" } },
  );
}
