import axios from 'axios';
import {Car, Segment} from "@/types/cars";
import {API_URL} from "@/config/environment";

const adminApi = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true, // Send httpOnly cookies automatically
});

export const checkAuthReq = async (): Promise<boolean> => {
    try {
        await adminApi.get('/auth/check');
        return true;
    } catch (error) {
        return false;
    }
}

export const getAllCars = async (): Promise<{cars: Car[]}> => {
    const res = await adminApi.get('/car'); // Подставьте ваш реальный endpoint
    return res.data;
};

export const getOneCar = async (id: string): Promise<Car> => {
    const res = await adminApi.get(`/car/${id}`);
    return res.data.car;
};

export const createCar = async (data: Partial<Car> = {}): Promise<Car> => {
    const res = await adminApi.post('/car', {data});
    return res.data.car;
};

export const updateCar = async (id: number, data: Partial<Car>): Promise<Car> => {
    const res = await adminApi.patch(`/car/${id}`, {data});
    return res.data;
};

export const deleteCar = async (id: number): Promise<void> => {
    await adminApi.delete(`/car/${id}`);
};

export const getSegments = async (): Promise<Segment[]> => {
    const res = await adminApi.get('/segment');
    return res.data.segments;
};

// Фото API
export const addPhoto = async (id: number, formData: FormData) => {
    return adminApi.post(`/car/${id}/photo`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
};

export const deletePhoto = async (carId: number, photoId: number) => {
    return adminApi.delete(`/car/${carId}/photo/${photoId}`);
};

export const updatePhoto = async (carId: number, data: { photoId: number; alt: string }) => {
    return adminApi.patch(`/car/${carId}/photo`, data);
};

export const addPreview = async (id: number, formData: FormData) => {
    return adminApi.patch(`/car/${id}/preview`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
};

export const updateRentalTariffs = async (id: number, tariffs: any[]) => {
    return adminApi.patch(`/car/${id}/tariff`, {data: tariffs});
};


// ── Report types ──

export interface DashboardData {
  activeRentals: number;
  confirmedReservations: number;
  newRequestsThisMonth: number;
  totalClients: number;
  revenueThisMonthMinor: number;
  revenueLastMonthMinor: number;
  completedRentalsThisMonth: number;
  overdueRentals: number;
  totalCarsAvailable: number;
  totalCars: number;
  fleetUtilizationPercent: number;
}

export interface RevenueDailyItem {
  date: string;
  income: number;
  expense: number;
  net: number;
}

export interface RevenueData {
  period: { from: string; to: string };
  totalIncome: number;
  totalExpense: number;
  net: number;
  daily: RevenueDailyItem[];
}

export interface FleetCarUtilization {
  carId: number;
  brand: string | null;
  model: string | null;
  plateNumber: string | null;
  rentedDays: number;
  totalDays: number;
  utilizationPercent: number;
}

export interface FleetUtilizationData {
  period: { from: string; to: string };
  totalDaysInPeriod: number;
  averageUtilizationPercent: number;
  cars: FleetCarUtilization[];
}

export interface OverdueRentalItem {
  id: number;
  returnDate: string;
  overdueDays: number;
  client: {
    id: number;
    firstName: string;
    lastName: string;
    phone: string | null;
    email: string | null;
  };
  car: {
    id: number;
    brand: string | null;
    model: string | null;
    plateNumber: string | null;
  };
}

export interface OverdueData {
  count: number;
  items: OverdueRentalItem[];
}

// ── Report API functions ──

export const getDashboard = async (): Promise<DashboardData> => {
  const res = await adminApi.get('/report/dashboard');
  return res.data;
};

export const getRevenue = async (from: string, to: string): Promise<RevenueData> => {
  const res = await adminApi.get('/report/revenue', { params: { from, to } });
  return res.data;
};

export const getFleetUtilization = async (from: string, to: string, segmentId?: number): Promise<FleetUtilizationData> => {
  const params: Record<string, string> = { from, to };
  if (segmentId) params.segmentId = String(segmentId);
  const res = await adminApi.get('/report/fleet-utilization', { params });
  return res.data;
};

export const getOverdueRentals = async (): Promise<OverdueData> => {
  const res = await adminApi.get('/report/overdue');
  return res.data;
};

// ── Admin notifications ──

export interface AdminNotification {
  id: string;
  type: 'request' | 'service' | 'overdue';
  title: string;
  message: string;
  createdAt: string;
}

export interface AdminNotificationsData {
  count: number;
  items: AdminNotification[];
}

export const getAdminNotifications = async (): Promise<AdminNotificationsData> => {
  const res = await adminApi.get('/report/notifications');
  return res.data;
};

// ── Global search ──

export interface SearchResult {
  id: number;
  type: 'client' | 'car' | 'request' | 'rental';
  title: string;
  subtitle: string;
}

export const globalSearch = async (q: string): Promise<SearchResult[]> => {
  const res = await adminApi.get('/report/search', { params: { q } });
  return res.data.results ?? [];
};

// ── Client duplicate check ──

export interface DuplicateClient {
  id: number;
  firstName: string;
  lastName: string;
  phone: string | null;
  email: string | null;
  createdAt: string;
  source: string | null;
}

export const checkClientDuplicates = async (phone?: string, email?: string): Promise<DuplicateClient[]> => {
  const params: Record<string, string> = {};
  if (phone) params.phone = phone;
  if (email) params.email = email;
  const res = await adminApi.get('/client/check-duplicates', { params });
  return res.data.duplicates ?? [];
};

// ── Sidebar badge helpers ──

export const getNewRequestsCount = async (): Promise<number> => {
  const res = await adminApi.get('/rental-request', { params: { status: 'new', page: 1, limit: 1 } });
  return res.data.total ?? 0;
};

// Named export for CRM pages
export const adminApiClient = adminApi;

// ── City & Pickup Location API ──

export interface CityListItem {
  id: number;
  slug: string;
  nameUk: string;
  nameRu: string;
  nameEn: string;
  nameLocativeUk: string;
  nameLocativeRu: string;
  nameLocativeEn: string;
  latitude: string;
  longitude: string;
  postalCode: string;
  region: string;
  sortOrder: number;
  isPopular: boolean;
  isActive: boolean;
  _count: { pickupLocations: number };
}

export interface PickupLocationItem {
  id: number;
  slug: string;
  nameUk: string;
  nameRu: string;
  nameEn: string;
  type: string;
  sortOrder: number;
  isActive: boolean;
}

export interface CityDetail extends Omit<CityListItem, '_count'> {
  pickupLocations: PickupLocationItem[];
}

export const getCities = async (params?: { page?: number; limit?: number; search?: string }) => {
  const res = await adminApi.get('/city', { params });
  return res.data as { cities: CityListItem[]; total: number; page: number; pages: number };
};

export const getCity = async (id: number): Promise<CityDetail> => {
  const res = await adminApi.get(`/city/${id}`);
  return res.data.city;
};

export const createCity = async (data: Partial<CityDetail>): Promise<CityDetail> => {
  const res = await adminApi.post('/city', data);
  return res.data.city;
};

export const updateCity = async (id: number, data: Partial<CityDetail>): Promise<CityDetail> => {
  const res = await adminApi.patch(`/city/${id}`, data);
  return res.data.city;
};

export const deleteCity = async (id: number): Promise<void> => {
  await adminApi.delete(`/city/${id}`);
};

export const createPickupLocation = async (cityId: number, data: Partial<PickupLocationItem>): Promise<PickupLocationItem> => {
  const res = await adminApi.post(`/city/${cityId}/location`, data);
  return res.data.location;
};

export const updatePickupLocation = async (cityId: number, locId: number, data: Partial<PickupLocationItem>): Promise<PickupLocationItem> => {
  const res = await adminApi.patch(`/city/${cityId}/location/${locId}`, data);
  return res.data.location;
};

export const deletePickupLocation = async (cityId: number, locId: number): Promise<void> => {
  await adminApi.delete(`/city/${cityId}/location/${locId}`);
};

// ── User Management ──
export const getUsers = async () => {
  const res = await adminApi.get('/user');
  return res.data;
};

export const getUser = async (id: number) => {
  const res = await adminApi.get(`/user/${id}`);
  return res.data;
};

export const createUser = async (data: { email: string; password: string; name: string; role: string; permissions: Record<string, string> }) => {
  const res = await adminApi.post('/user', data);
  return res.data;
};

export const updateUser = async (id: number, data: { name?: string; role?: string; permissions?: Record<string, string>; isActive?: boolean }) => {
  const res = await adminApi.patch(`/user/${id}`, data);
  return res.data;
};

export const changeUserPassword = async (id: number, password: string) => {
  const res = await adminApi.patch(`/user/${id}/password`, { password });
  return res.data;
};

export const deleteUser = async (id: number) => {
  await adminApi.delete(`/user/${id}`);
};

export default adminApi;
