import { API_URL } from "@/config/environment";

interface BookingRequestData {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  pickupLocation: string;
  returnLocation: string;
  startDate: Date;
  endDate: Date;
  flightNumber?: string;
  comment?: string;
  carId?: number;
  carDetails?: any;
  selectedPlan?: string;
  selectedExtras?: any;
  totalCost?: number;
  totalDays?: number;
}

interface ContactRequestData {
  name: string;
  email: string;
  phone: string;
  message?: string;
}

interface CallbackRequestData {
  name: string;
  phone: string;
  contactMethod?: string;
}

interface BusinessRequestData {
  name: string;
  phone: string;
  email: string;
  message?: string;
}

export async function submitBookingRequest(data: BookingRequestData): Promise<any> {
  const res = await fetch(`${API_URL}/feedback/bookings`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error(`Submit booking request failed: ${res.status} ${res.statusText}`);
  }

  return res.json();
}

export async function submitContactRequest(data: ContactRequestData): Promise<any> {
  const res = await fetch(`${API_URL}/feedback/contacts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error(`Submit contact request failed: ${res.status} ${res.statusText}`);
  }

  return res.json();
}

export async function submitCallbackRequest(data: CallbackRequestData): Promise<any> {
  const res = await fetch(`${API_URL}/feedback/rents`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error(`Submit callback request failed: ${res.status} ${res.statusText}`);
  }

  return res.json();
}

export async function submitBusinessRequest(data: BusinessRequestData): Promise<any> {
  const res = await fetch(`${API_URL}/feedback/rents-business`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error(`Submit business request failed: ${res.status} ${res.statusText}`);
  }

  return res.json();
}
