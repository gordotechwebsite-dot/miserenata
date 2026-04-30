// Post-build pre-render: takes dist/index.html (output of vite build) and writes
// a per-route HTML with the right <title>, canonical, OG/Twitter meta tags so that
// crawlers (Googlebot, social previews) see the correct metadata before any JS runs.
//
// We don't render React; the body/script tags are identical across pages, only the
// <head> metadata changes. The React app then hydrates client-side as usual.

import { readFile, writeFile, mkdir } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DIST = join(__dirname, "..", "dist");
const SITE = "https://musicaenvivo.co";
const OG_IMAGE = `${SITE}/images/mariachi-hero.jpg`;

const SERVICE_AREA = [
  { "@type": "AdministrativeArea", name: "Boyacá" },
  { "@type": "City", name: "Duitama" },
  { "@type": "City", name: "Paipa" },
  { "@type": "City", name: "Sogamoso" },
  { "@type": "City", name: "Tunja" },
  { "@type": "City", name: "Nobsa" },
];

function genreServiceJsonLd({ id, name, description, image }) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${SITE}/${id}#service`,
    name,
    description,
    serviceType: "Música en vivo",
    category: name,
    url: `${SITE}/${id}`,
    image,
    provider: { "@id": `${SITE}/#business` },
    areaServed: SERVICE_AREA,
    audience: {
      "@type": "Audience",
      audienceType:
        "Personas y empresas que organizan serenatas, fiestas, bodas y eventos corporativos",
    },
  };
}

/**
 * @typedef {{
 *   path: string,
 *   title: string,
 *   description: string,
 *   ogTitle?: string,
 *   extraJsonLd?: object[],
 * }} Route
 */
/** @type {Route[]} */
const ROUTES = [
  {
    path: "/",
    title:
      "Musicaenvivo.co · Serenatas, Mariachis y Artistas en Vivo en Boyacá",
    description:
      "El arte de sorprender: serenatas románticas, mariachis y artistas en vivo para eventos y experiencias VIP en Duitama, Paipa y Sogamoso. Reserva tu momento inolvidable.",
    ogTitle: "Musicaenvivo.co · El arte de sorprender",
  },
  {
    path: "/mariachi",
    title: "Mariachis en Boyacá · Serenatas y eventos | Musicaenvivo.co",
    description:
      "Mariachis profesionales para serenatas, sorpresas y eventos en Duitama, Paipa y Sogamoso. Repertorio clásico mexicano y arreglos personalizados. Reserva por WhatsApp.",
    ogTitle: "Mariachis en Boyacá · Musicaenvivo.co",
    extraJsonLd: [
      genreServiceJsonLd({
        id: "mariachi",
        name: "Mariachi",
        description:
          "Mariachi profesional con vestuario charro completo (trajes de gala, sombreros, botas) y formación tradicional: trompetas, violines, vihuela y guitarrón. Repertorio clásico mexicano y arreglos personalizados para serenatas, cumpleaños, aniversarios, declaraciones y eventos en Boyacá.",
        image: `${SITE}/images/mariachi-hero.jpg`,
      }),
    ],
  },
  {
    path: "/nortena",
    title: "Música Norteña en Boyacá · Grupos y eventos | Musicaenvivo.co",
    description:
      "Grupos de música norteña para fiestas, cumpleaños y eventos en Boyacá. Acordeón, bajo sexto y batería en vivo. Cotiza por hora o paquete.",
    ogTitle: "Música Norteña en Boyacá · Musicaenvivo.co",
    extraJsonLd: [
      genreServiceJsonLd({
        id: "nortena",
        name: "Música norteña",
        description:
          "Grupo norteño en vivo con formación tradicional: acordeón, bajo sexto, bajo eléctrico y batería. Repertorio de corridos, cumbias norteñas y baladas para parrandas, cumpleaños, fiestas privadas y celebraciones en Boyacá. Cobro por hora con sonido amplificado incluido.",
        image: `${SITE}/images/guitar.jpg`,
      }),
    ],
  },
  {
    path: "/banda",
    title: "Banda en vivo en Boyacá · Eventos y shows | Musicaenvivo.co",
    description:
      "Banda en vivo para bodas, grados, cumpleaños y eventos corporativos en Boyacá. Repertorio amplio, sonido profesional. Cotiza por hora.",
    ogTitle: "Banda en vivo · Musicaenvivo.co",
    extraJsonLd: [
      genreServiceJsonLd({
        id: "banda",
        name: "Banda en vivo",
        description:
          "Banda en vivo con metales (trompetas, trombones, saxos), percusión y voz para eventos grandes en Boyacá: bodas, matrimonios, grados, fiestas corporativas. Repertorio amplio (tropical, vallenatos, cumbias, baladas, crossover). Cobro por hora con sonido y luces incluidos.",
        image: `${SITE}/images/trumpet.jpg`,
      }),
    ],
  },
  {
    path: "/faq",
    title: "Preguntas frecuentes | Musicaenvivo.co",
    description:
      "Resuelve dudas sobre reservas, cobertura, formas de pago, repertorio y más para tu serenata, mariachi o artista en vivo en Boyacá.",
    ogTitle: "Preguntas frecuentes · Musicaenvivo.co",
  },
];

function escapeAttr(s) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function escapeHtml(s) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function applyMeta(html, route) {
  const url = `${SITE}${route.path === "/" ? "/" : route.path}`;
  const title = escapeHtml(route.title);
  const description = escapeAttr(route.description);
  const ogTitle = escapeAttr(route.ogTitle ?? route.title);

  let out = html;

  // <title>
  out = out.replace(/<title>[\s\S]*?<\/title>/, `<title>${title}</title>`);

  // meta name="description"
  out = out.replace(
    /<meta\s+name="description"\s+content="[^"]*"\s*\/>/,
    `<meta name="description" content="${description}" />`
  );

  // canonical
  out = out.replace(
    /<link\s+rel="canonical"\s+href="[^"]*"\s*\/>/,
    `<link rel="canonical" href="${url}" />`
  );

  // og:url
  out = out.replace(
    /<meta\s+property="og:url"\s+content="[^"]*"\s*\/>/,
    `<meta property="og:url" content="${url}" />`
  );

  // og:title
  out = out.replace(
    /<meta\s+property="og:title"\s+content="[^"]*"\s*\/>/,
    `<meta property="og:title" content="${ogTitle}" />`
  );

  // og:description
  out = out.replace(
    /<meta\s+property="og:description"\s+content="[^"]*"\s*\/>/,
    `<meta property="og:description" content="${description}" />`
  );

  // og:image stays the same (mariachi-hero.jpg) but ensure it's absolute
  out = out.replace(
    /<meta\s+property="og:image"\s+content="[^"]*"\s*\/>/,
    `<meta property="og:image" content="${OG_IMAGE}" />`
  );

  // twitter
  out = out.replace(
    /<meta\s+name="twitter:title"\s+content="[^"]*"\s*\/>/,
    `<meta name="twitter:title" content="${ogTitle}" />`
  );
  out = out.replace(
    /<meta\s+name="twitter:description"\s+content="[^"]*"\s*\/>/,
    `<meta name="twitter:description" content="${description}" />`
  );

  // Inject extra JSON-LD blocks (per-route Service schemas, etc.) just before
  // </head> so crawlers see them on the static HTML pass without waiting for JS.
  if (route.extraJsonLd && route.extraJsonLd.length > 0) {
    const blocks = route.extraJsonLd
      .map(
        (obj) =>
          `<script type="application/ld+json">${JSON.stringify(obj)}</script>`
      )
      .join("\n    ");
    out = out.replace("</head>", `    ${blocks}\n  </head>`);
  }

  return out;
}

async function main() {
  const indexPath = join(DIST, "index.html");
  const baseHtml = await readFile(indexPath, "utf8");

  for (const route of ROUTES) {
    const html = applyMeta(baseHtml, route);
    const outPath =
      route.path === "/"
        ? indexPath
        : join(DIST, route.path.replace(/^\//, ""), "index.html");
    await mkdir(dirname(outPath), { recursive: true });
    await writeFile(outPath, html, "utf8");
    console.log(`prerender ${route.path} -> ${outPath}`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
