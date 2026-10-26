// Bogotá edition of the site (bogota.musicaenvivo.co). Shared by the React app
// and scripts/prerender.mjs: rewrites Boyacá city lists into Bogotá copy.

export const BOGOTA_HOST = "bogota.musicaenvivo.co";
export const BOGOTA_SITE = `https://${BOGOTA_HOST}`;

const CITY =
  /\b(?:Villa de Leyva|Santa Rosa de Viterbo|Duitama|Paipa|Sogamoso|Tunja|Nobsa|Belén|Sutamarchán|Tibasosa|Chiquinquirá)\b/g;

export const BOGOTA_ZONES = ["Bogotá", "Chía", "Cajicá", "La Calera"];

export const BOGOTA_FAQ = {
  q: "¿Llevan mariachis y músicos a Chía, Cajicá y La Calera?",
  a: "Sí. Llevamos mariachis, grupos norteños y banda en vivo a casas, fincas, restaurantes y salones de Bogotá, Chía, Cajicá y La Calera. Para otros municipios de la Sabana cotizamos el desplazamiento.",
};

const L = "A-Za-zÁÉÍÓÚáéíóúÑñ";
const TAIL =
  "( y (?:otros )?(?:municipios cercanos(?: de)? |municipios de |resto de |todo )?Boyacá| y municipios cercanos)?";

function zoneList(prefix, sep, tail) {
  const items = BOGOTA_ZONES.map((z) => prefix + z);
  if (sep === " · ") return items.join(" · ");
  if (tail) return `${items.join(", ")} y municipios cercanos`;
  return `${items.slice(0, -1).join(", ")} y ${items[items.length - 1]}`;
}

export function toBogota(text) {
  return text
    .replace(CITY, "§")
    .replace(/todo el corredor /g, "")
    .replace(
      new RegExp(`(?<![${L}])([${L}][${L} ]{0,24} )§(?:(?:, | y )\\1§)+${TAIL}`, "g"),
      (_, prefix, tail) => zoneList(prefix, ", ", tail)
    )
    .replace(
      new RegExp(`§(?:(, | y | · |–)§)*${TAIL}`, "g"),
      (m, sep, tail) => (sep || tail ? zoneList("", sep, tail) : "Bogotá")
    )
    .replace(/en Vivo en Boyacá/g, "en Vivo en Bogotá, Chía, Cajicá y La Calera")
    .replace(/fuera del corredor(?: industrial)?/g, "fuera de la zona")
    .replace(/municipios cercanos de Boyacá/g, "otros municipios de la Sabana")
    .replace(/toda Boyacá|todo Boyacá/g, "Bogotá y la Sabana")
    .replace(/Boyacá/g, "Bogotá")
    .replace(/Bogotá y Bogotá/g, "Bogotá")
    .replace(/(en Bogotá), [a-záéíóúñ ]+ en Bogotá,/g, "$1,");
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
