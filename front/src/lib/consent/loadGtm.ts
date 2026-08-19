"use client";

import { GTM_CONTAINER_ID } from "@/config/analytics";
import {
  toGoogleConsentMode,
  type ConsentPreferences,
} from "./preferences";

let gtmLoaded = false;

type GtmWindow = Window & { dataLayer?: unknown[] };

function pushGoogleConsent(
  preferences: ConsentPreferences,
  action: "default" | "update",
) {
  const windowWithDataLayer = window as GtmWindow;
  windowWithDataLayer.dataLayer = windowWithDataLayer.dataLayer ?? [];
  windowWithDataLayer.dataLayer.push([
    "consent",
    action,
    toGoogleConsentMode(preferences),
  ]);
}

function isGtmAlreadyPresent() {
  return Boolean(
    document.getElementById("gtm") || document.getElementById("reiz-gtm"),
  );
}

function deleteCookie(name: string) {
  const expires = "expires=Thu, 01 Jan 1970 00:00:00 GMT";
  const secure = window.location.protocol === "https:" ? "; Secure" : "";
  const hostname = window.location.hostname;

  document.cookie = `${name}=; ${expires}; path=/; SameSite=Lax${secure}`;

  // Analytics services normally set a cookie either for the exact host or
  // for the parent domain. Clear both variants when the browser permits it.
  if (hostname && hostname !== "localhost") {
    document.cookie = `${name}=; ${expires}; path=/; domain=${hostname}; SameSite=Lax${secure}`;
    document.cookie = `${name}=; ${expires}; path=/; domain=.${hostname}; SameSite=Lax${secure}`;
  }
}

function deleteKnownOptionalCookies(preferences: ConsentPreferences) {
  const cookieNames = document.cookie
    .split(";")
    .map((part) => part.trim().split("=")[0])
    .filter(Boolean);

  for (const name of cookieNames) {
    const isAnalyticsCookie =
      name === "_ga" || name.startsWith("_ga_") || name === "_gid" || name === "_gat";
    const isMarketingCookie =
      name === "_gcl_au" || name === "_fbp" || name === "_fbc";

    if ((isAnalyticsCookie && !preferences.analytics) || (isMarketingCookie && !preferences.marketing)) {
      deleteCookie(name);
    }
  }
}

/**
 * Applies a changed choice immediately. Google tags that use Consent Mode
 * receive the update; known first-party optional cookies are cleared when a
 * category is withdrawn. Custom GTM tags must also be configured in GTM to
 * require the matching consent category.
 */
export function updateGtmConsent(preferences: ConsentPreferences) {
  if (typeof window === "undefined") return;

  pushGoogleConsent(preferences, "update");
  deleteKnownOptionalCookies(preferences);
}

/**
 * Loads GTM only after the visitor has enabled at least one optional
 * category. The default consent state is queued before the GTM script, which
 * is Google Consent Mode's basic (blocking) implementation.
 */
export function loadGtm(preferences: ConsentPreferences) {
  if (typeof window === "undefined") return;

  const alreadyLoaded = gtmLoaded || isGtmAlreadyPresent();
  pushGoogleConsent(preferences, alreadyLoaded ? "update" : "default");
  deleteKnownOptionalCookies(preferences);

  if (alreadyLoaded) {
    gtmLoaded = true;
    return;
  }

  gtmLoaded = true;
  const windowWithDataLayer = window as GtmWindow;
  windowWithDataLayer.dataLayer = windowWithDataLayer.dataLayer ?? [];
  windowWithDataLayer.dataLayer.push({ "gtm.start": Date.now(), event: "gtm.js" });

  const script = document.createElement("script");
  script.id = "reiz-gtm";
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtm.js?id=${GTM_CONTAINER_ID}`;
  document.head.appendChild(script);
}
