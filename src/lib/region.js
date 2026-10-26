// Bogotá edition of the site (bogota.musicaenvivo.co). Shared by the React app
// and scripts/prerender.mjs: rewrites Boyacá city lists into Bogotá copy.

export const BOGOTA_HOST = "bogota.musicaenvivo.co";
export const BOGOTA_SITE = `https://${BOGOTA_HOST}`;

const CITY =
  /\b(?:Villa de Leyva|Santa Rosa de Viterbo|Duitama|Paipa|Sogamoso|Tunja|Nobsa|Belén|Sutamarchán|Tibasosa|Chiquinquirá)\b/g;

export function toBogota(text) {
  return text
    .replace(CITY, "§")
    .replace(/§(?:(?:, | y | · )(?:mariachi en )?§)+/g, "§")
    .replace(
      /§ y (?:municipios cercanos de |municipios de |resto de |todo )?Boyacá/g,
      "Bogotá y municipios cercanos"
    )
    .replace(/§ y municipios cercanos/g, "Bogotá y municipios cercanos")
    .replace(/§/g, "Bogotá")
    .replace(/fuera del corredor(?: industrial)?/g, "fuera de Bogotá")
    .replace(/municipios cercanos de Boyacá/g, "municipios cercanos a Bogotá")
    .replace(/toda Boyacá|todo Boyacá/g, "toda Bogotá")
    .replace(/Boyacá/g, "Bogotá")
    .replace(/Bogotá y Bogotá/g, "Bogotá");
}

export function isBogotaHost() {
  if (typeof window === "undefined") return false;
  if (window.location.hostname === BOGOTA_HOST) return true;
  try {
    const q = new URLSearchParams(window.location.search).get("sede");
    if (q === "bogota") window.sessionStorage.setItem("sede", "bogota");
    return window.sessionStorage.getItem("sede") === "bogota";
  } catch {
    return false;
  }
}

export const IS_BOGOTA = isBogotaHost();

/** Localize copy for the current edition (no-op on musicaenvivo.co). */
export function loc(text) {
  return IS_BOGOTA ? toBogota(text) : text;
}
