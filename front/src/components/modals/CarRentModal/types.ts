export const formatFull = (d: Date) => {
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  return `${dd}.${mm}.${yyyy}`;
};

export const formatTime = (d: Date) => {
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  return `${hh}:${mm}`;
};

export type ExtraDefinition = {
  id: "additionalDriver" | "childSeat" | "borderCrossing" | "driverService";
  price: number;
  pricing: "perDay" | "perRental";
};

export const EXTRA_DEFINITIONS = [
  { id: "additionalDriver", price: 6, pricing: "perDay" },
  { id: "childSeat", price: 3, pricing: "perDay" },
  { id: "borderCrossing", price: 150, pricing: "perRental" },
  { id: "driverService", price: 80, pricing: "perDay" },
] as const satisfies ExtraDefinition[];

export type ExtraId = (typeof EXTRA_DEFINITIONS)[number]["id"];

export type FormState = {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  pickupLocation: string;
  returnLocation: string;
  flightNumber: string;
  comment: string;
  consent: boolean;
};

const createExtraMap = () => {
  const map: Record<ExtraId, ExtraDefinition> = {
    additionalDriver: EXTRA_DEFINITIONS[0],
    childSeat: EXTRA_DEFINITIONS[1],
    borderCrossing: EXTRA_DEFINITIONS[2],
    driverService: EXTRA_DEFINITIONS[3],
  };
  return map;
};

export const EXTRAS_BY_ID = createExtraMap();

export const DEFAULT_FORM_STATE: FormState = {
  firstName: "",
  lastName: "",
  phone: "",
  email: "",
  pickupLocation: "",
  returnLocation: "",
  flightNumber: "",
  comment: "",
  consent: false,
};

export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
