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

export interface OverdueClient {
  id: number;
  firstName: string;
  lastName: string;
  phone: string;
}
export interface OverdueCar {
  id: number;
  brand: string;
  model: string;
  plateNumber: string;
}
export interface OverdueRental {
  id: number;
  status: string;
  returnDate: string;
  overdueDays: number;
  client: OverdueClient;
  car: OverdueCar;
}

export interface DailyRevenue {
  date: string;
  income: number;
  expense: number;
  net: number;
}
export interface RevenueData {
  totalIncome: number;
  totalExpense: number;
  net: number;
  daily: DailyRevenue[];
}

export interface FleetCar {
  carId: number;
  brand: string | null;
  model: string | null;
  plateNumber: string | null;
  rentedDays: number;
  totalDays: number;
  utilizationPercent: number;
}
export interface FleetData {
  totalDaysInPeriod: number;
  averageUtilizationPercent: number;
  cars: FleetCar[];
}
