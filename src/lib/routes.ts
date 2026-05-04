import type { GenreId } from "./constants";

export const LANDING_PATHS = [
  "/serenatas",
  "/eventos-corporativos",
  "/bodas",
  "/cumpleanos",
  "/serenata-mama",
] as const;
export type LandingPath = (typeof LANDING_PATHS)[number];

export type Route =
  | { kind: "home" }
  | { kind: "admin" }
  | { kind: "faq" }
  | { kind: "genre"; id: GenreId }
  | { kind: "landing"; path: LandingPath };

const GENRE_IDS: GenreId[] = ["mariachi", "nortena", "banda"];

export function parseRoute(input: string): Route {
  const raw = (input || "").split("?")[0].split("#")[0];
  const path = raw.startsWith("/") ? raw : `/${raw}`;
  const seg = path.replace(/\/+$/g, "").replace(/^\/+/g, "");

  if (seg === "admin") return { kind: "admin" };
  if (seg === "faq") return { kind: "faq" };
  if ((GENRE_IDS as string[]).includes(seg)) {
    return { kind: "genre", id: seg as GenreId };
  }
  const candidate = `/${seg}` as LandingPath;
  if ((LANDING_PATHS as readonly string[]).includes(candidate)) {
    return { kind: "landing", path: candidate };
  }

  const hashOnly = (input || "").includes("#")
    ? input.slice(input.indexOf("#"))
    : "";
  if (hashOnly === "#admin") return { kind: "admin" };
  if (hashOnly === "#faq") return { kind: "faq" };
  const m = hashOnly.match(/^#genero-([a-z]+)$/);
  if (m && (GENRE_IDS as string[]).includes(m[1])) {
    return { kind: "genre", id: m[1] as GenreId };
  }

  return { kind: "home" };
}

export function genrePath(id: GenreId): string {
  return `/${id}`;
}

export function routePath(route: Route): string {
  switch (route.kind) {
    case "home":
      return "/";
    case "admin":
      return "/admin";
    case "faq":
      return "/faq";
    case "genre":
      return `/${route.id}`;
    case "landing":
      return route.path;
  }
}

export function navigate(path: string): void {
  if (typeof window === "undefined") return;
  const target = path || "/";
  const current = window.location.pathname + window.location.search;
  if (current !== target) {
    window.history.pushState({}, "", target);
  }
  window.dispatchEvent(new PopStateEvent("popstate"));
}

export function genreHash(id: GenreId): string {
  return `#genero-${id}`;
}
