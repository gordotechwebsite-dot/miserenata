// Landing pages per municipality for the Bogotá edition (bogota.musicaenvivo.co).
// Shared by the React app and scripts/prerender.mjs.

import { LOCALIDADES } from "./localidades.js";

const RECARGO =
  "Para llegar hasta allá se suma un recargo por desplazamiento que depende de la distancia; te lo confirmamos al cotizar.";

export const MUNICIPIOS = [
  {
    slug: "chia",
    name: "Chía",
    title: "Mariachis en Chía · Serenatas y música en vivo | Musicaenvivo.co",
    description:
      "Mariachis, grupos norteños y banda en vivo en Chía para serenatas, cumpleaños, bodas y eventos. Llegamos a casas, conjuntos, fincas y restaurantes. Cotiza por WhatsApp.",
    h1: "Mariachis y música en vivo en Chía",
    intro: [
      "Chía es de celebraciones en casa y en finca: conjuntos residenciales, casas campestres y restaurantes sobre la vía a Cota y el camino hacia Cajicá. Allí llevamos mariachi con vestuario charro, grupo norteño o banda completa, puntuales y con sonido propio.",
      "Una serenata de cumpleaños a primera hora, una sorpresa de aniversario en la noche o la fiesta de una boda en finca: armamos el repertorio contigo y coordinamos la llegada para que la sorpresa salga como la planeaste.",
    ],
    services: {
      mariachi:
        "Serenatas en conjuntos y casas de Chía, Las Mañanitas al amanecer y sorpresas románticas con canciones a pedido.",
      nortena:
        "Acordeón, bajo sexto y batería para parrandas en finca y fiestas familiares de fin de semana.",
      banda:
        "Metales, percusión y voz para bodas, grados y celebraciones grandes en salones y fincas.",
    },
    occasions:
      "Cumpleaños, aniversarios, propuestas de matrimonio, bodas en finca, grados, quinceaños y eventos de empresa en Chía.",
    faqs: [
      {
        q: "¿Cuánto cuesta un mariachi en Chía?",
        a: `Depende del paquete (número de canciones o duración del show). ${RECARGO}`,
      },
      {
        q: "¿Llegan a veredas y fincas de Chía?",
        a: "Sí. Vamos a conjuntos, casas campestres, fincas y restaurantes. Compártenos la ubicación por WhatsApp para planear la llegada.",
      },
      {
        q: "¿Con cuánto tiempo debo reservar?",
        a: "Para serenatas, idealmente 24 a 48 horas antes. Para bodas y eventos grandes, 2 a 4 semanas.",
      },
    ],
  },
  {
    slug: "cajica",
    name: "Cajicá",
    title: "Mariachis en Cajicá · Serenatas y eventos en vivo | Musicaenvivo.co",
    description:
      "Mariachis, música norteña y banda en vivo en Cajicá para serenatas, cumpleaños, bodas y fiestas. Casas campestres, conjuntos y salones. Reserva por WhatsApp.",
    h1: "Mariachis y música en vivo en Cajicá",
    intro: [
      "En Cajicá las fiestas suelen ser en casa campestre, en conjunto cerrado o en salones de eventos de la Sabana. Llevamos mariachi, grupo norteño o banda a cualquiera de esos espacios, con presentación impecable y sonido incluido en los eventos.",
      "Si quieres sorprender a alguien con una serenata, celebrar unos quince o animar el cierre de una boda, te ayudamos a escoger el formato y las canciones según el lugar y el número de invitados.",
    ],
    services: {
      mariachi:
        "Serenatas de cumpleaños, aniversario o reconciliación en Cajicá, con trompetas, violines, vihuela y guitarrón.",
      nortena:
        "Corridos, cumbias norteñas y baladas para fiestas privadas y reuniones familiares.",
      banda:
        "Banda completa para bodas, quinceaños y eventos de empresa con muchos invitados.",
    },
    occasions:
      "Serenatas, cumpleaños, quinceaños, bodas en casa campestre, grados, baby showers y celebraciones de empresa en Cajicá.",
    faqs: [
      {
        q: "¿Cuánto cuesta un mariachi en Cajicá?",
        a: `El valor depende del paquete o de las horas de show. ${RECARGO}`,
      },
      {
        q: "¿Tocan en conjuntos cerrados?",
        a: "Sí. Coordinamos el ingreso con portería y llegamos a la hora acordada para no dañar la sorpresa.",
      },
      {
        q: "¿Puedo pedir canciones específicas?",
        a: "Claro. Tenemos un repertorio amplio de mariachi, bolero y ranchera, y preparamos canciones especiales con aviso previo.",
      },
    ],
  },
  {
    slug: "la-calera",
    name: "La Calera",
    title: "Mariachis en La Calera · Música en vivo para eventos | Musicaenvivo.co",
    description:
      "Mariachis, grupos norteños y banda en vivo en La Calera para bodas en finca, cumpleaños, serenatas y eventos al aire libre. Cotiza por WhatsApp.",
    h1: "Mariachis y música en vivo en La Calera",
    intro: [
      "La Calera es de fincas, miradores y casas de campo con vista a la ciudad: el lugar ideal para bodas al aire libre, almuerzos familiares largos y celebraciones que piden música en vivo de principio a fin.",
      "Subimos con mariachi, grupo norteño o banda y adaptamos el montaje al espacio, ya sea en terraza, en jardín o en salón. Coordinamos contigo la hora de llegada y el repertorio de cada momento del evento.",
    ],
    services: {
      mariachi:
        "Mariachi para la entrada de la novia, el brindis o una serenata sorpresa en finca.",
      nortena:
        "Grupo norteño para animar asados, almuerzos campestres y fiestas de fin de semana.",
      banda:
        "Banda con metales y percusión para bodas y celebraciones grandes al aire libre.",
    },
    occasions:
      "Bodas en finca, aniversarios, cumpleaños, propuestas en miradores, grados y eventos corporativos en La Calera.",
    faqs: [
      {
        q: "¿Cuánto cuesta un mariachi en La Calera?",
        a: `Depende del paquete o de la duración del show. ${RECARGO}`,
      },
      {
        q: "¿Tocan en fincas y eventos al aire libre?",
        a: "Sí. Llevamos el sonido para exteriores y nos adaptamos a terrazas, jardines y salones.",
      },
      {
        q: "¿Con cuánto tiempo debo reservar una boda?",
        a: "Recomendamos reservar con 2 a 4 semanas de anticipación para asegurar la fecha.",
      },
    ],
  },
];

export { LOCALIDADES };

export const HUB = {
  slug: "localidades",
  title: "Mariachis por localidad en Bogotá · Serenatas a domicilio | Musicaenvivo.co",
  description:
    "Mariachis, grupo norteño y banda en vivo en las 19 localidades de Bogotá: Suba, Kennedy, Engativá, Usaquén, Chapinero, Bosa y más. Serenatas a domicilio y eventos.",
  h1: "Mariachis en todas las localidades de Bogotá",
  intro:
    "Llevamos serenatas y música en vivo a domicilio en toda la ciudad, del norte al sur. Escoge tu localidad para ver cómo trabajamos allí.",
};

export const ZONAS = [...MUNICIPIOS, ...LOCALIDADES];

export const MUNICIPIO_SLUGS = [...ZONAS.map((m) => m.slug), "localidades"];

export function getMunicipio(slug) {
  return ZONAS.find((m) => m.slug === slug);
}
