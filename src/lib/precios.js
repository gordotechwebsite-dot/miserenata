// Copy for the Bogotá /precios page. Shared by React and scripts/prerender.mjs.

export const DEFAULT_HOURLY_RATE = { papayera: 380000, nortena: 600000, banda: 800000 };

export const PRECIOS = {
  slug: "precios",
  title: "Precios de mariachis en Bogotá · Serenatas, norteña y banda | Musicaenvivo.co",
  h1: "Precios de mariachis y música en vivo en Bogotá",
  intro:
    "Estos son los precios de nuestras serenatas con mariachi y de la norteña y la banda por hora. Son los mismos que ves al reservar, sin letra pequeña.",
  recargo:
    "Fuera de la zona habitual se suma un recargo por desplazamiento que depende de la distancia. Te lo confirmamos antes de reservar.",
};

const cop = (n) => `$${String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`;

export function preciosDescription(minMariachi) {
  return minMariachi
    ? `Serenatas con mariachi en Bogotá desde ${cop(minMariachi)}. Precios de paquetes, norteña y banda por hora, qué incluye cada uno y cómo reservar. Cotiza por WhatsApp.`
    : "Precios de serenatas con mariachi, norteña y banda por hora en Bogotá: qué incluye cada paquete y cómo reservar. Cotiza por WhatsApp.";
}

export function preciosFaqs(minMariachi, hourly) {
  return [
    {
      q: "¿Cuánto cuesta un mariachi en Bogotá?",
      a: minMariachi
        ? `Una serenata con mariachi cuesta desde ${cop(minMariachi)}. El valor depende de la duración, el número de canciones y de músicos. ${PRECIOS.recargo}`
        : `Depende de la duración, el número de canciones y de músicos. ${PRECIOS.recargo}`,
    },
    {
      q: "¿Cuál es la serenata más económica?",
      a: "El paquete más corto, con menos canciones y músicos. Es ideal para una sorpresa rápida de cumpleaños o aniversario.",
    },
    {
      q: "¿Cuánto cuesta un grupo norteño o una banda por hora?",
      a: `El grupo norteño cuesta ${cop(hourly.nortena)} por hora y la banda ${cop(hourly.banda)} por hora, con sonido amplificado incluido. La papayera cuesta ${cop(hourly.papayera)} por hora. Puedes contratar desde 1 hora.`,
    },
    {
      q: "¿Cómo se paga la reserva?",
      a: "Con el 50% aseguras la fecha y el resto se paga el día del evento. Recibimos Nequi, Daviplata, Bancolombia, efectivo o tarjeta.",
    },
  ];
}

export { cop };
