"use server";

import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

const API_URL = process.env.API_URL_INTERNAL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";
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
  const result = await customerFetch("/profile", {
    method: "PUT",
    body: JSON.stringify(data),
  });

  if (result !== null) {
    revalidatePath("/account");
  }

  return result;
}

export async function getReservations(status?: string) {
  const qs = status ? `?status=${status}` : "";
  return (await customerFetch(`/reservations${qs}`)) || [];
}

export async function getRentals(status?: string) {
  const qs = status ? `?status=${status}` : "";
  return (await customerFetch(`/rentals${qs}`)) || [];
}

export async function getBookingHistory(
  filter?: "active" | "history" | "cancelled",
  page = 1,
  limit = 20,
) {
  const params = new URLSearchParams();
  if (filter) params.set("filter", filter);
  if (page > 1) params.set("page", String(page));
  if (limit !== 20) params.set("limit", String(limit));
  const qs = params.toString() ? `?${params.toString()}` : "";
  return (
    (await customerFetch(`/booking-history${qs}`)) || {
      items: [],
      total: 0,
      page: 1,
      limit: 20,
      totalPages: 0,
    }
  );
}

export async function getCustomerStats() {
  return await customerFetch("/stats");
}

export async function requestCancellation(
  reservationId: number,
  reason?: string,
) {
  return customerFetch(`/reservations/${reservationId}/request-cancel`, {
    method: "POST",
    body: JSON.stringify({ reason }),
  });
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
