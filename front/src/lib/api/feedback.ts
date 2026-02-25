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
  selectedPlan?: any;
  selectedExtras?: any;
  totalDays?: number;
  priceBreakdown?: {
    baseRentalCost: number;
    insuranceCost: number;
    extrasCost: number;
    totalCost: number;
    depositAmount: number;
  };
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

interface InvestRequestData {
  car: string;
  model: string;
  transmission?: string;
  mileage?: string;
  year?: string;
  color?: string;
  complect?: string;
  name: string;
  phone: string;
  email: string;
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

export async function submitInvestRequest(data: InvestRequestData): Promise<any> {
  const res = await fetch(`${API_URL}/feedback/invest`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error(`Submit invest request failed: ${res.status} ${res.statusText}`);
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
