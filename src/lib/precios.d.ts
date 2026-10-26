export const DEFAULT_HOURLY_RATE: { nortena: number; banda: number };
export const PRECIOS: {
  slug: string;
  title: string;
  h1: string;
  intro: string;
  recargo: string;
};
export function preciosDescription(minMariachi?: number): string;
export function preciosFaqs(
  minMariachi: number | undefined,
  hourly: { nortena: number; banda: number }
): { q: string; a: string }[];
export function cop(n: number): string;
