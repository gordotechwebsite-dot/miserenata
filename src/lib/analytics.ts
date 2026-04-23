declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

export const GA_MEASUREMENT_ID: string =
  (import.meta.env.VITE_GA_MEASUREMENT_ID as string) || "";

let loaded = false;

export function initAnalytics(): void {
  if (loaded) return;
  if (!GA_MEASUREMENT_ID) return;
  if (typeof window === "undefined") return;
  loaded = true;

  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag(...args: unknown[]) {
    window.dataLayer!.push(args);
  };
  window.gtag("js", new Date());
  window.gtag("config", GA_MEASUREMENT_ID, {
    anonymize_ip: true,
    send_page_view: true,
  });

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(
    GA_MEASUREMENT_ID
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
