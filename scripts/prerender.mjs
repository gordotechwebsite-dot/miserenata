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

// Static body HTML injected inside <div id="root"> so crawlers see real,
// keyword-rich content on the first HTML pass (before any JS executes).
// React replaces this when it mounts client-side; users only see it briefly
// while React hydrates (or permanently if JS is disabled).
const STATIC_STYLE = `
  background:#0c0a09;color:#e7e5e4;min-height:100vh;
  padding:2.5rem 1.25rem;font-family:system-ui,-apple-system,sans-serif;
  line-height:1.6;
`.replace(/\s+/g, " ");

const STATIC_INNER_STYLE = "max-width:48rem;margin:0 auto;";

function staticBody(content) {
  return `<div style="${STATIC_STYLE}"><div style="${STATIC_INNER_STYLE}">${content}</div></div>`;
}

function genreStaticBody({ id, h1, intro, repertoire, coverage, reserva, faqs }) {
  const faqHtml = faqs
    .map(
      (q) =>
        `<div style="margin:0.75rem 0"><h3 style="color:#fcd34d;font-size:1rem;margin:0 0 0.25rem">${escapeHtml(q.q)}</h3><p style="margin:0;font-size:0.95rem">${escapeHtml(q.a)}</p></div>`
    )
    .join("");
  return staticBody(`
    <h1 style="font-size:1.75rem;font-weight:900;color:#fef3c7;margin:0 0 0.75rem;line-height:1.2">${escapeHtml(h1)}</h1>
    <p style="font-size:1rem;margin:0 0 1.5rem;color:#d6d3d1">${escapeHtml(intro)}</p>
    <h2 style="font-size:1.25rem;font-weight:700;color:#fcd34d;margin:1.5rem 0 0.5rem">Repertorio</h2>
    <p style="margin:0 0 1rem;font-size:0.95rem">${escapeHtml(repertoire)}</p>
    <h2 style="font-size:1.25rem;font-weight:700;color:#fcd34d;margin:1.5rem 0 0.5rem">Cobertura en Boyacá</h2>
    <p style="margin:0 0 1rem;font-size:0.95rem">${escapeHtml(coverage)}</p>
    <h2 style="font-size:1.25rem;font-weight:700;color:#fcd34d;margin:1.5rem 0 0.5rem">Reservas y precios</h2>
    <p style="margin:0 0 1rem;font-size:0.95rem">${escapeHtml(reserva)}</p>
    <h2 style="font-size:1.25rem;font-weight:700;color:#fcd34d;margin:1.5rem 0 0.5rem">Preguntas frecuentes</h2>
    ${faqHtml}
    <p style="margin:1.5rem 0 0;font-size:0.95rem;color:#a8a29e">Cargando experiencia interactiva…</p>
  `);
}

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
 *   staticBody?: string,
 * }} Route
 */
/** @type {Route[]} */
const ROUTES = [
  {
    path: "/",
    title:
      "Musicaenvivo.co · Serenatas, Mariachis y Artistas en Vivo en Boyacá",
    description:
      "El arte de sorprender: serenatas románticas, mariachis y artistas en vivo para eventos y experiencias VIP en Duitama, Paipa, Sogamoso, Tunja y Boyacá. Reserva tu momento inolvidable.",
    ogTitle: "Musicaenvivo.co · El arte de sorprender",
    staticBody: staticBody(`
      <h1 style="font-size:1.75rem;font-weight:900;color:#fef3c7;margin:0 0 0.75rem;line-height:1.2">Música en vivo en Boyacá: mariachi, norteña y banda</h1>
      <p style="font-size:1rem;margin:0 0 1.5rem;color:#d6d3d1">Serenatas, mariachis y artistas en vivo para eventos en Duitama, Paipa, Sogamoso, Tunja, Nobsa y municipios de Boyacá. Contrata por hora o por paquete: cumpleaños, aniversarios, declaraciones, bodas, grados, fiestas privadas y eventos corporativos. Reserva con anticipación por WhatsApp y asegura tu fecha con el 50%.</p>
      <h2 style="font-size:1.25rem;font-weight:700;color:#fcd34d;margin:1.5rem 0 0.5rem">Mariachi en Duitama, Paipa y Sogamoso</h2>
      <p style="margin:0 0 1rem;font-size:0.95rem"><a href="/mariachi" style="color:#fcd34d;text-decoration:underline">Mariachi profesional con vestuario charro</a> y formación tradicional (trompetas, violines, vihuela y guitarrón). Repertorio clásico mexicano: Las Mañanitas, El Rey, Cielito Lindo, Bésame Mucho, Volver Volver. Ideal para serenatas y declaraciones románticas.</p>
      <h2 style="font-size:1.25rem;font-weight:700;color:#fcd34d;margin:1.5rem 0 0.5rem">Grupos norteños en Boyacá</h2>
      <p style="margin:0 0 1rem;font-size:0.95rem"><a href="/nortena" style="color:#fcd34d;text-decoration:underline">Música norteña en vivo</a> con acordeón, bajo sexto, bajo eléctrico y batería. Corridos, cumbias norteñas y baladas para parrandas y fiestas en Duitama, Paipa, Sogamoso, Tunja y Nobsa.</p>
      <h2 style="font-size:1.25rem;font-weight:700;color:#fcd34d;margin:1.5rem 0 0.5rem">Banda para eventos grandes</h2>
      <p style="margin:0 0 1rem;font-size:0.95rem"><a href="/banda" style="color:#fcd34d;text-decoration:underline">Banda en vivo</a> con metales (trompetas, trombones, saxos), percusión y voz. Tropical, vallenatos, cumbias, crossover. Para bodas, matrimonios, grados y eventos corporativos en Boyacá.</p>
      <p style="margin:1.5rem 0 0;font-size:0.95rem;color:#a8a29e">Cargando experiencia interactiva…</p>
    `),
  },
  {
    path: "/mariachi",
    title: "Mariachis en Boyacá · Serenatas y eventos | Musicaenvivo.co",
    description:
      "Mariachis profesionales para serenatas, sorpresas y eventos en Duitama, Paipa, Sogamoso, Tunja y Boyacá. Repertorio clásico mexicano y arreglos personalizados. Reserva por WhatsApp.",
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
    staticBody: genreStaticBody({
      id: "mariachi",
      h1: "Mariachi profesional en Duitama, Paipa, Sogamoso, Tunja y Boyacá",
      intro:
        "Contratamos mariachis profesionales con vestuario charro completo (trajes de gala, sombreros y botas) y formación tradicional: trompetas, violines, vihuela y guitarrón. Especialistas en serenatas románticas, cumpleaños, aniversarios, declaraciones, despedidas, bodas y eventos corporativos en todo Boyacá. Cotización por WhatsApp en minutos.",
      repertoire:
        "Más de 200 canciones del cancionero clásico mexicano: Las Mañanitas, El Rey, Cielito Lindo, Bésame Mucho, Volver Volver, Si Nos Dejan, La Bamba, Para Adoloridos, Que Bonita es esta Vida, Caballo Viejo, Hermoso Cariño y arreglos personalizados por pedido. Ranchera, bolero, huapango y mariachi moderno.",
      coverage:
        "Cobertura completa en Boyacá: mariachi en Duitama, mariachi en Paipa, mariachi en Sogamoso, mariachi en Tunja, mariachi en Nobsa, mariachi en Belén, mariachi en Sutamarchán, mariachi en Villa de Leyva y municipios cercanos. Para localidades fuera del corredor industrial cotizamos recargo por desplazamiento. Llegamos puntuales y con presentación impecable.",
      reserva:
        "Reserva con al menos 24 horas de anticipación; para bodas y eventos grandes recomendamos 2 a 4 semanas. Pago en Nequi, Daviplata, Bancolombia, efectivo o tarjeta — el 50% asegura tu fecha y el saldo se paga el día del evento. Precio mariachi por hora o por paquete: contrata 3, 5 o 10 canciones, o cotiza un show completo. Pide tu cotización personalizada por WhatsApp al +57 313 8969608.",
      faqs: [
        {
          q: "¿Cuánto cuesta un mariachi en Duitama?",
          a: "Manejamos paquetes desde 3 canciones hasta show completo de 1+ hora. El precio depende del repertorio, la duración y la ciudad. Cotiza tu mariachi por WhatsApp y te enviamos opciones a medida.",
        },
        {
          q: "¿El mariachi incluye sonido?",
          a: "Las presentaciones acústicas tradicionales no requieren sonido (mariachi acústico para serenatas íntimas). Para eventos grandes podemos sumar sonido amplificado, luces y video con costo adicional.",
        },
        {
          q: "¿Atienden Tunja, Sogamoso y Paipa?",
          a: "Sí. Cubrimos todo el corredor Duitama–Paipa–Sogamoso–Tunja–Nobsa y municipios cercanos de Boyacá. Para destinos más lejanos cotizamos recargo por desplazamiento al confirmar la fecha.",
        },
      ],
    }),
  },
  {
    path: "/nortena",
    title: "Música Norteña en Boyacá · Grupos y eventos | Musicaenvivo.co",
    description:
      "Grupos de música norteña para fiestas, cumpleaños y eventos en Duitama, Paipa, Sogamoso, Tunja y Boyacá. Acordeón, bajo sexto y batería en vivo. Cotiza por hora.",
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
    staticBody: genreStaticBody({
      id: "nortena",
      h1: "Grupos norteños en vivo en Duitama, Paipa, Sogamoso y Boyacá",
      intro:
        "Contratamos grupos de música norteña en vivo con formación tradicional: acordeón, bajo sexto, bajo eléctrico y batería. Perfectos para parrandas, cumpleaños, fiestas privadas, celebraciones familiares y eventos donde necesitas el sabor del norte. Cobertura en Duitama, Paipa, Sogamoso, Tunja, Nobsa y todo Boyacá. Cotización por WhatsApp.",
      repertoire:
        "Repertorio amplio: corridos clásicos y modernos, cumbias norteñas, baladas románticas, polkas, redovas y los hits que prenden cualquier fiesta — de Los Tigres del Norte, Los Cardenales, Los Tucanes, Banda MS y más. Si quieres un repertorio específico, lo preparamos al reservar.",
      coverage:
        "Música norteña en Duitama, música norteña en Paipa, música norteña en Sogamoso, música norteña en Tunja, música norteña en Nobsa, música norteña en Belén, música norteña en Sutamarchán y otros municipios de Boyacá. Para destinos fuera de la zona se cotiza recargo por desplazamiento.",
      reserva:
        "Cotización por hora con un mínimo de presentación. El precio que ves es el precio que pagas — sin recargos sorpresa, con sonido amplificado profesional incluido. Reserva con 24 horas mínimo; para fechas pico (diciembre, fines de semana de puente) recomendamos 1–2 semanas. Pago: Nequi, Daviplata, Bancolombia, efectivo o tarjeta. 50% asegura la fecha.",
      faqs: [
        {
          q: "¿Cuánto cuesta un grupo norteño por hora?",
          a: "Cobramos por hora con un mínimo de presentación. El valor depende de la ciudad, la fecha y el horario. Cotiza por WhatsApp con la fecha y la dirección y te confirmamos en minutos.",
        },
        {
          q: "¿El sonido está incluido?",
          a: "Sí. El precio por hora incluye sonido amplificado profesional para fiestas y eventos. No necesitas conseguir nada extra.",
        },
        {
          q: "¿Atienden Sogamoso y Tunja?",
          a: "Sí. Tocamos en Duitama, Paipa, Sogamoso, Tunja, Nobsa y municipios cercanos de Boyacá. Para destinos más lejanos cotizamos un recargo por desplazamiento.",
        },
      ],
    }),
  },
  {
    path: "/banda",
    title: "Banda en vivo en Boyacá · Eventos y shows | Musicaenvivo.co",
    description:
      "Banda en vivo para bodas, grados, cumpleaños y eventos corporativos en Duitama, Paipa, Sogamoso, Tunja y Boyacá. Repertorio amplio, sonido profesional. Cotiza por hora.",
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
    staticBody: genreStaticBody({
      id: "banda",
      h1: "Banda en vivo para eventos en Duitama, Paipa, Sogamoso y Boyacá",
      intro:
        "Banda con sonido completo: metales (trompetas, trombones, saxos), percusión y voz. Diseñada para eventos grandes — bodas, matrimonios, grados, fiestas corporativas y celebraciones masivas — donde necesitas energía alta y un sonido que llene cualquier espacio. Cobertura en todo Boyacá. Cotización por WhatsApp.",
      repertoire:
        "Repertorio amplio: tropical, vallenatos, cumbias, baladas, clásicos populares, salsa, merengue y crossover. Coordinamos un setlist a medida contigo antes del evento — desde la entrada de la novia hasta la fiesta de cierre. Hits de Carlos Vives, Silvestre Dangond, Grupo Niche, Diomedes Díaz, La Sonora Dinamita y más.",
      coverage:
        "Banda en vivo en Duitama, banda en Paipa, banda en Sogamoso, banda en Tunja, banda en Nobsa, banda en Belén, banda en Sutamarchán, banda en Villa de Leyva y municipios de Boyacá. Para localidades más lejanas cotizamos recargo por desplazamiento al confirmar la fecha.",
      reserva:
        "Cotización por hora. El precio incluye sonido profesional y luces de escenario; no necesitas conseguir producción aparte. Para bodas y eventos grandes recomendamos reservar con 2 a 4 semanas de anticipación. Coordinamos sound check, escenario y cronograma con el organizador para que el evento corra sin sorpresas. Pago: Nequi, Daviplata, Bancolombia, efectivo o tarjeta. 50% asegura la fecha.",
      faqs: [
        {
          q: "¿Cuánto cuesta una banda para una boda en Boyacá?",
          a: "El precio depende del número de músicos, las horas contratadas, la ciudad y la fecha. Para una boda típica trabajamos paquetes de 2 a 4 horas. Cotiza por WhatsApp con la fecha del evento y te enviamos opciones.",
        },
        {
          q: "¿La banda trae su propio sonido?",
          a: "Sí. El precio por hora incluye sonido profesional y luces de escenario. Solo necesitas un espacio adecuado y energía eléctrica suficiente para el equipo.",
        },
        {
          q: "¿Cuántos músicos tiene la banda?",
          a: "Configuración estándar: metales (trompetas, trombones, saxos), percusión completa y voz. El número exacto se ajusta al tamaño del evento — desde formato compacto hasta banda grande con coros.",
        },
      ],
    }),
  },
  {
    path: "/faq",
    title: "Preguntas frecuentes | Musicaenvivo.co",
    description:
      "Resuelve dudas sobre reservas, cobertura, formas de pago, repertorio y más para tu serenata, mariachi o artista en vivo en Duitama, Paipa, Sogamoso, Tunja y Boyacá.",
    ogTitle: "Preguntas frecuentes · Musicaenvivo.co",
    staticBody: staticBody(`
      <h1 style="font-size:1.75rem;font-weight:900;color:#fef3c7;margin:0 0 0.75rem;line-height:1.2">Preguntas frecuentes — Musicaenvivo.co</h1>
      <p style="font-size:1rem;margin:0 0 1.5rem;color:#d6d3d1">Resolvemos las dudas más comunes sobre cómo contratar mariachis, grupos norteños y banda en vivo para eventos en Duitama, Paipa, Sogamoso, Tunja, Nobsa y municipios de Boyacá.</p>
      <h2 style="font-size:1.1rem;font-weight:700;color:#fcd34d;margin:1.25rem 0 0.25rem">¿Con cuánta anticipación debo reservar?</h2>
      <p style="margin:0 0 1rem;font-size:0.95rem">Mínimo 24 horas para serenatas y eventos pequeños. Para bodas, matrimonios, grados y eventos corporativos recomendamos 2 a 4 semanas para asegurar la fecha y coordinar el repertorio.</p>
      <h2 style="font-size:1.1rem;font-weight:700;color:#fcd34d;margin:1.25rem 0 0.25rem">¿Qué formas de pago aceptan?</h2>
      <p style="margin:0 0 1rem;font-size:0.95rem">Aceptamos Nequi, Daviplata, transferencia Bancolombia, efectivo y tarjeta. El 50% asegura tu fecha al reservar y el saldo se paga el día del evento.</p>
      <h2 style="font-size:1.1rem;font-weight:700;color:#fcd34d;margin:1.25rem 0 0.25rem">¿Qué ciudades cubren?</h2>
      <p style="margin:0 0 1rem;font-size:0.95rem">Cobertura completa en Duitama, Paipa, Sogamoso, Tunja, Nobsa, Belén, Sutamarchán, Villa de Leyva y municipios cercanos de Boyacá. Para destinos más lejanos cotizamos recargo por desplazamiento.</p>
      <h2 style="font-size:1.1rem;font-weight:700;color:#fcd34d;margin:1.25rem 0 0.25rem">¿Hacen arreglos personalizados?</h2>
      <p style="margin:0 0 1rem;font-size:0.95rem">Sí. Si quieres una canción específica que no esté en nuestro repertorio, avísanos al reservar y la preparamos para tu evento.</p>
      <p style="margin:1.5rem 0 0;font-size:0.95rem;color:#a8a29e">Cargando experiencia interactiva…</p>
    `),
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

  // Inject keyword-rich static body inside <div id="root"> so crawlers see real
  // content on the first pass. React replaces these children when it mounts
  // client-side via createRoot(...).render(...). Users with JS see this only
  // for the brief window before hydration; users without JS see it permanently.
  if (route.staticBody) {
    out = out.replace(
      /<div\s+id="root">\s*<\/div>/,
      `<div id="root">${route.staticBody}</div>`
    );
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
