// Tiny inline SVG placeholders that match the brand palette (dark stone + amber).
// Avoids hitting placehold.co (network call + flicker) and keeps the bundle tiny.

const BG = "#1c1917";
const FG = "#d4af37";
const SUB = "#78716c";

function svgDataUri(svg: string): string {
  // Use encodeURIComponent so the SVG is a valid data URI without base64 overhead.
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

function escape(s: string): string {
  return s.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case "<":
        return "&lt;";
      case ">":
        return "&gt;";
      case "&":
        return "&amp;";
      case "'":
        return "&apos;";
      case '"':
        return "&quot;";
      default:
        return c;
    }
  });
}

/**
 * Returns an inline SVG data URI that says `text` with brand colors,
 * sized to approximately match `width x height` so the layout doesn't shift.
 */
export function placeholderSvg(
  text: string,
  width: number = 800,
  height: number = 600
): string {
  const fontSize = Math.round(Math.min(width, height) * 0.08);
  const subSize = Math.round(fontSize * 0.45);
  const safe = escape(text);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" preserveAspectRatio="xMidYMid slice"><rect width="100%" height="100%" fill="${BG}"/><text x="50%" y="50%" fill="${FG}" font-family="system-ui,sans-serif" font-weight="800" font-size="${fontSize}" text-anchor="middle" dominant-baseline="middle">${safe}</text><text x="50%" y="${
    height / 2 + fontSize
  }" fill="${SUB}" font-family="system-ui,sans-serif" font-size="${subSize}" text-anchor="middle">musicaenvivo.co</text></svg>`;
  return svgDataUri(svg);
}

/** Small generic brand placeholder used when we don't have specific text. */
export const BRAND_PLACEHOLDER = placeholderSvg("Musicaenvivo", 400, 300);
