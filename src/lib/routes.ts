import type { GenreId } from "./constants";

export type Route =
  | { kind: "home" }
  | { kind: "admin" }
  | { kind: "faq" }
  | { kind: "genre"; id: GenreId };

const GENRE_IDS: GenreId[] = ["mariachi", "nortena", "banda"];

export function parseRoute(hash: string): Route {
  if (hash === "#admin") return { kind: "admin" };
  if (hash === "#faq") return { kind: "faq" };
  const m = hash.match(/^#genero-([a-z]+)$/);
  if (m && (GENRE_IDS as string[]).includes(m[1])) {
    return { kind: "genre", id: m[1] as GenreId };
  }
  return { kind: "home" };
}

export function genreHash(id: GenreId): string {
  return `#genero-${id}`;
}
