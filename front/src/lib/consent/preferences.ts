export type ConsentPreferences = {
  analytics: boolean;
  marketing: boolean;
};

export const NO_OPTIONAL_CONSENT: ConsentPreferences = {
  analytics: false,
  marketing: false,
};

export const ALL_OPTIONAL_CONSENT: ConsentPreferences = {
  analytics: true,
  marketing: true,
};

const CONSENT_COOKIE_VERSION = "v1";

/**
 * Cookie values are deliberately compact, but versioned so a later change to
 * the categories can safely ask the visitor for a new choice.
 */
export function serializeConsentPreferences({
  analytics,
  marketing,
}: ConsentPreferences): string {
  return `${CONSENT_COOKIE_VERSION}.a${analytics ? "1" : "0"}.m${marketing ? "1" : "0"}`;
}

/**
 * `rejected` is the previous single-choice value and is safe to retain as an
 * opt-out. A legacy `accepted` value is intentionally not treated as consent
 * for the new, separate categories — visitors can make an informed choice.
 */
export function parseConsentPreferences(
  value: string | undefined,
): ConsentPreferences | null {
  if (value === "rejected") return NO_OPTIONAL_CONSENT;

  const match = value?.match(/^v1\.a([01])\.m([01])$/);
  if (!match) return null;

  return {
    analytics: match[1] === "1",
    marketing: match[2] === "1",
  };
}

export function hasOptionalConsent({
  analytics,
  marketing,
}: ConsentPreferences): boolean {
  return analytics || marketing;
}

export function toGoogleConsentMode({
  analytics,
  marketing,
}: ConsentPreferences) {
  return {
    ad_storage: marketing ? "granted" : "denied",
    analytics_storage: analytics ? "granted" : "denied",
    ad_user_data: marketing ? "granted" : "denied",
    ad_personalization: marketing ? "granted" : "denied",
  } as const;
}
