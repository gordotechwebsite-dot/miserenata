declare global {
  interface Window {
    google?: typeof google;
    __googleMapsLoading__?: Promise<void>;
  }
}

export const GOOGLE_MAPS_API_KEY: string =
  (import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string) || "";

export function loadGoogleMaps(): Promise<void> {
  if (!GOOGLE_MAPS_API_KEY) {
    return Promise.reject(new Error("Google Maps API key not configured"));
  }
  if (typeof window === "undefined") {
    return Promise.reject(new Error("Not in browser"));
  }
  if (window.google && window.google.maps && window.google.maps.places) {
    return Promise.resolve();
  }
  if (window.__googleMapsLoading__) return window.__googleMapsLoading__;
  window.__googleMapsLoading__ = new Promise((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(
      'script[data-google-maps="true"]'
    );
    if (existing) {
      existing.addEventListener("load", () => resolve());
      existing.addEventListener("error", () =>
        reject(new Error("Failed to load Google Maps"))
      );
      return;
    }
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(
      GOOGLE_MAPS_API_KEY
    )}&libraries=places&language=es&region=co&loading=async`;
    script.async = true;
    script.defer = true;
    script.dataset.googleMaps = "true";
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load Google Maps"));
    document.head.appendChild(script);
  });
  return window.__googleMapsLoading__;
}
