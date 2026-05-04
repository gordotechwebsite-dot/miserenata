declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

export const GA_MEASUREMENT_ID: string =
  (import.meta.env.VITE_GA_MEASUREMENT_ID as string) || "G-D0KRH01GW5";

export const ADS_CONVERSION_ID: string =
  (import.meta.env.VITE_ADS_CONVERSION_ID as string) || "AW-18139766225";

const ADS_LABELS: Record<AdsConversionType, string> = {
  whatsapp: (import.meta.env.VITE_ADS_LABEL_WHATSAPP as string) || "",
  form: (import.meta.env.VITE_ADS_LABEL_FORM as string) || "",
  phone: (import.meta.env.VITE_ADS_LABEL_PHONE as string) || "",
};

const ADS_DEFAULT_VALUES: Record<AdsConversionType, number> = {
  whatsapp: 50000,
  form: 100000,
  phone: 30000,
};

export type AdsConversionType = "whatsapp" | "form" | "phone";

export function initAnalytics(): void {
  // gtag.js + consent default + GA4/Ads config are loaded inline in index.html
  // (Google's recommended pattern). Nothing to do here.
}

export function trackEvent(
  name: string,
  params?: Record<string, unknown>
): void {
  if (!GA_MEASUREMENT_ID) return;
  if (typeof window === "undefined" || !window.gtag) return;
  window.gtag("event", name, params || {});
}

export function trackPageView(path: string, title?: string): void {
  if (!GA_MEASUREMENT_ID) return;
  if (typeof window === "undefined" || !window.gtag) return;
  window.gtag("event", "page_view", {
    page_path: path,
    page_location:
      typeof window.location !== "undefined"
        ? `${window.location.origin}${path}`
        : undefined,
    page_title: title,
  });
}

export function trackAdsConversion(
  type: AdsConversionType,
  value?: number
): void {
  if (!ADS_CONVERSION_ID) return;
  const label = ADS_LABELS[type];
  if (!label) return;
  if (typeof window === "undefined" || !window.gtag) return;
  window.gtag("event", "conversion", {
    send_to: `${ADS_CONVERSION_ID}/${label}`,
    value: value ?? ADS_DEFAULT_VALUES[type],
    currency: "COP",
  });
}

export function trackWhatsAppClick(): void {
  trackEvent("whatsapp_click");
  trackAdsConversion("whatsapp");
}

export function trackPhoneClick(): void {
  trackEvent("phone_click");
  trackAdsConversion("phone");
}
