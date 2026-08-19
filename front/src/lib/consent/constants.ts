export const CONSENT_COOKIE_NAME = "cookie_consent";
export const CONSENT_COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 180; // 180 days

// Fired by CookieSettingsLink (e.g. the footer link) to reopen the banner
// after the visitor already made a choice.
export const OPEN_COOKIE_CONSENT_EVENT = "reiz:open-cookie-consent";
