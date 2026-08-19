import { headers } from "next/headers";
import geoip from "geoip-lite";

// EU (27) + EEA (IS, LI, NO) + UK (post-Brexit UK GDPR still applies).
export const CONSENT_REQUIRED_COUNTRIES = new Set([
  "AT", "BE", "BG", "HR", "CY", "CZ", "DK", "EE", "FI", "FR", "DE", "GR",
  "HU", "IE", "IT", "LV", "LT", "LU", "MT", "NL", "PL", "PT", "RO", "SK",
  "SI", "ES", "SE",
  "IS", "LI", "NO",
  "GB",
]);

function getClientIp(headerList: Headers): string | null {
  // Cloudflare injects this at the edge with the original client address.
  // Prefer it over x-forwarded-for, which can otherwise contain an edge IP
  // when there is more than one reverse proxy in front of the app.
  const cloudflareClientIp = headerList
    .get("cf-connecting-ip")
    ?.trim()
    .replace(/^::ffff:/i, "");
  if (cloudflareClientIp) return cloudflareClientIp;

  const forwardedFor = headerList.get("x-forwarded-for");
  if (forwardedFor) {
    // Caddy appends the real client IP first in the chain.
    const first = forwardedFor.split(",")[0]?.trim();
    if (first) return first.replace(/^::ffff:/i, "");
  }
  return headerList.get("x-real-ip")?.replace(/^::ffff:/i, "") ?? null;
}

function getCloudflareCountry(headerList: Headers): string | null {
  // Cloudflare sets this header at its edge. It is used only as an
  // additional signal that consent is required; an IP lookup remains the
  // fallback for every other case, so an untrusted header can never opt a
  // visitor out of the banner.
  const country = headerList.get("cf-ipcountry")?.toUpperCase();
  return country && /^[A-Z]{2}$/.test(country) && country !== "XX"
    ? country
    : null;
}

/**
 * Whether the visitor is in a jurisdiction that legally requires opt-in
 * cookie consent (EU/EEA/UK). Fails safe: any uncertainty (no IP, lookup
 * miss, geoip data error) resolves to `true` — showing the banner to
 * someone who didn't strictly need it is fine, silently skipping it for
 * someone who did is the risk we're not willing to take.
 */
export async function requiresCookieConsent(): Promise<boolean> {
  try {
    const headerList = await headers();
    const cloudflareCountry = getCloudflareCountry(headerList);

    // This keeps the strict path correct when Cloudflare is in front of the
    // origin and x-forwarded-for contains an edge address instead of the
    // visitor's real IP.
    if (
      cloudflareCountry &&
      CONSENT_REQUIRED_COUNTRIES.has(cloudflareCountry)
    ) {
      return true;
    }

    const ip = getClientIp(headerList);

    if (!ip || ip === "127.0.0.1" || ip === "::1") {
      return true;
    }

    const geo = geoip.lookup(ip);
    if (!geo?.country) {
      return true;
    }

    return CONSENT_REQUIRED_COUNTRIES.has(geo.country);
  } catch {
    return true;
  }
}
