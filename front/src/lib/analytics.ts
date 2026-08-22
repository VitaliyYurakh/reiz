"use client";

type AnalyticsValue = string | number | boolean | null | undefined;

export type AnalyticsEventName =
  | "search_availability"
  | "booking_contact_open"
  | "view_item"
  | "begin_checkout"
  | "deposit_option_selected"
  | "booking_request"
  | "generate_lead"
  | "click_phone"
  | "click_messenger";

export type AnalyticsEventParams = Record<string, AnalyticsValue>;

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>;
  }
}

/**
 * Sends a consent-aware event to GTM's dataLayer.
 *
 * Do not pass names, phone numbers, email addresses, or message text here.
 * GTM/GA4 can use the page and business context without receiving PII.
 */
export function trackEvent(
  event: AnalyticsEventName,
  params: AnalyticsEventParams = {},
) {
  if (typeof window === "undefined") return;

  const cleanParams = Object.fromEntries(
    Object.entries(params).filter(([, value]) => value !== undefined && value !== null),
  );

  window.dataLayer = window.dataLayer ?? [];
  window.dataLayer.push({
    event,
    ...cleanParams,
    page_path: window.location.pathname,
    page_location: window.location.href,
  });
}
