"use server";

import { auth } from "@/auth";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";
const SERVICE_SECRET = process.env.SERVICE_SECRET || "";

async function customerFetch(
  path: string,
  options: RequestInit = {},
): Promise<any> {
  const session = await auth();
  if (!session?.user?.clientId) {
    return null;
  }

  const url = `${API_URL}/customer${path}`;

  try {
    const res = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        "x-service-secret": SERVICE_SECRET,
        "x-client-id": String(session.user.clientId),
        ...options.headers,
      },
    });

    if (!res.ok) {
      console.error(`[customerFetch] ${res.status} ${res.statusText} — ${url}`);
      return null;
    }

    const contentType = res.headers.get("content-type") || "";
    if (!contentType.includes("application/json")) {
      console.error(`[customerFetch] Non-JSON response from ${url}`);
      return null;
    }

    return res.json();
  } catch (err) {
    console.error(`[customerFetch] Failed to fetch ${url}:`, err);
    return null;
  }
}

export async function getProfile() {
  return customerFetch("/profile");
}

export async function updateProfile(data: Record<string, unknown>) {
  return customerFetch("/profile", {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function getReservations(status?: string) {
  const qs = status ? `?status=${status}` : "";
  return (await customerFetch(`/reservations${qs}`)) || [];
}

export async function getRentals(status?: string) {
  const qs = status ? `?status=${status}` : "";
  return (await customerFetch(`/rentals${qs}`)) || [];
}

export async function getFavorites() {
  return (await customerFetch("/favorites")) || [];
}

export async function addFavorite(carId: number) {
  return customerFetch(`/favorites/${carId}`, { method: "POST" });
}

export async function removeFavorite(carId: number) {
  await customerFetch(`/favorites/${carId}`, { method: "DELETE" });
}

export async function getNotificationPreferences() {
  return (
    (await customerFetch("/notifications")) || {
      emailDeals: true,
      emailReminders: true,
      emailReceipts: true,
    }
  );
}

export async function updateNotificationPreferences(
  data: Record<string, boolean>,
) {
  return customerFetch("/notifications", {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function exportUserData() {
  return customerFetch("/export");
}

export async function deleteAccount() {
  return customerFetch("/account", { method: "DELETE" });
}
