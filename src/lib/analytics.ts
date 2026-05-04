declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

export const GA_MEASUREMENT_ID: string =
  (import.meta.env.VITE_GA_MEASUREMENT_ID as string) || "";

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

let loaded = false;

export function initAnalytics(): void {
  if (loaded) return;
  if (!GA_MEASUREMENT_ID && !ADS_CONVERSION_ID) return;
  if (typeof window === "undefined") return;
  loaded = true;

  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag(...args: unknown[]) {
    window.dataLayer!.push(args);
  };
  window.gtag("consent", "default", {
    ad_storage: "granted",
    analytics_storage: "granted",
    ad_user_data: "granted",
    ad_personalization: "granted",
  });
  window.gtag("js", new Date());
  if (GA_MEASUREMENT_ID) {
    window.gtag("config", GA_MEASUREMENT_ID, {
      anonymize_ip: true,
      send_page_view: true,
    });
  }
  if (ADS_CONVERSION_ID) {
    window.gtag("config", ADS_CONVERSION_ID);
  }

  const tagId = GA_MEASUREMENT_ID || ADS_CONVERSION_ID;
  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(
    tagId
  )}`;
  document.head.appendChild(script);
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
  window.gtag("config", GA_MEASUREMENT_ID, {
    page_path: path,
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
