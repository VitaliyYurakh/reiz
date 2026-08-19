import { cookies } from "next/headers";
import { CONSENT_COOKIE_NAME } from "./constants";
import {
  parseConsentPreferences,
  type ConsentPreferences,
} from "./preferences";

export async function getConsentPreferences(): Promise<ConsentPreferences | null> {
  const cookieStore = await cookies();
  const value = cookieStore.get(CONSENT_COOKIE_NAME)?.value;
  return parseConsentPreferences(value);
}
