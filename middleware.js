// Vercel Routing Middleware: serve the Bogotá edition (dist/bogota/*) on
// bogota.musicaenvivo.co. Runs before the filesystem, so "/" can be remapped.
const BOGOTA_HOST = "bogota.musicaenvivo.co";

export const config = {
  matcher: [
    "/",
    "/(mariachi|nortena|banda|serenatas|eventos-corporativos|bodas|cumpleanos|faq)",
    "/(sitemap.xml|robots.txt)",
  ],
};

export default function middleware(request) {
  const url = new URL(request.url);
  const host = (request.headers.get("host") || "").split(":")[0];
  const preview = url.searchParams.get("sede") === "bogota";
  if (host !== BOGOTA_HOST && !preview) return;

  const path = url.pathname.replace(/\/+$/, "");
  // cleanUrls: /bogota/index.html is not addressable, /bogota is.
  url.pathname = `/bogota${path}`;
  return new Response(null, {
    headers: { "x-middleware-rewrite": url.toString() },
  });
}
