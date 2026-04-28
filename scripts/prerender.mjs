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

/** @type {Array<{ path: string, title: string, description: string, ogTitle?: string }>} */
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
  },
  {
    path: "/nortena",
    title: "Música Norteña en Boyacá · Grupos y eventos | Musicaenvivo.co",
    description:
      "Grupos de música norteña para fiestas, cumpleaños y eventos en Boyacá. Acordeón, bajo sexto y batería en vivo. Cotiza por hora o paquete.",
    ogTitle: "Música Norteña en Boyacá · Musicaenvivo.co",
  },
  {
    path: "/banda",
    title: "Banda en vivo en Boyacá · Eventos y shows | Musicaenvivo.co",
    description:
      "Banda en vivo para bodas, grados, cumpleaños y eventos corporativos en Boyacá. Repertorio amplio, sonido profesional. Cotiza por hora.",
    ogTitle: "Banda en vivo · Musicaenvivo.co",
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
