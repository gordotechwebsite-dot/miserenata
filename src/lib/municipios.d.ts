export type Municipio = {
  slug: string;
  name: string;
  kind?: "localidad";
  barrios?: string[];
  title: string;
  description: string;
  h1: string;
  intro: string[];
  services: { mariachi: string; nortena: string; banda: string };
  occasions: string;
  faqs: { q: string; a: string }[];
};
export const MUNICIPIOS: Municipio[];
export const MUNICIPIO_SLUGS: string[];
export function getMunicipio(slug: string): Municipio | undefined;
export const LOCALIDADES: Municipio[];
export const HUB: {
  slug: string;
  title: string;
  description: string;
  h1: string;
  intro: string;
};
export const ZONAS: Municipio[];
