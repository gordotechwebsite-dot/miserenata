// Bogotá localities for the Bogotá edition. Each entry has original copy;
// the rest of the page is assembled in localidad().

const L = [
  ["usaquen", "Usaquén", ["Santa Bárbara", "Cedritos", "Country", "Santa Ana", "Usaquén pueblo"],
    "En Usaquén tocamos en apartamentos de Cedritos y Santa Bárbara, en casas del Country y Santa Ana y en los restaurantes alrededor del parque fundacional, donde una serenata en la terraza es un clásico de aniversario."],
  ["chapinero", "Chapinero", ["Chicó", "Rosales", "Quinta Camacho", "Chapinero Alto", "Zona G"],
    "Chapinero mezcla edificios residenciales del Chicó y Rosales con restaurantes de la Zona G y Quinta Camacho. Llegamos con mariachi a la portería o al salón comunal, y coordinamos con el restaurante cuando la sorpresa es en la mesa."],
  ["santa-fe", "Santa Fe", ["La Macarena", "Las Nieves", "La Perseverancia", "Germania"],
    "En Santa Fe las serenatas suenan en los apartamentos de La Macarena, en las casas de La Perseverancia y en los cafés y restaurantes del centro, donde el mariachi encaja bien en cenas íntimas y celebraciones de oficina."],
  ["san-cristobal", "San Cristóbal", ["20 de Julio", "La Victoria", "San Blas", "Villa Javier"],
    "San Cristóbal es de fiestas en familia: la serenata en la casa de la mamá en el 20 de Julio, los quince en un salón de La Victoria o el cumpleaños del abuelo en San Blas. Llevamos mariachi, norteña o banda hasta la puerta."],
  ["usme", "Usme", ["Santa Librada", "La Aurora", "Usme centro", "Alfonso López"],
    "En Usme llegamos a casas de Santa Librada, La Aurora y Usme centro, y también a fincas y salones de la zona rural para primeras comuniones, matrimonios y celebraciones de fin de semana."],
  ["tunjuelito", "Tunjuelito", ["Venecia", "San Carlos", "Tunjuelito", "Abraham Lincoln"],
    "En Tunjuelito tocamos en casas y salones de Venecia, San Carlos y Abraham Lincoln: serenatas de cumpleaños, despedidas de año en la empresa y fiestas familiares con norteña o banda."],
  ["bosa", "Bosa", ["Bosa Centro", "El Recreo", "La Libertad", "Bosa Porvenir", "Metrovivienda"],
    "Bosa tiene muchos conjuntos nuevos en El Recreo, Porvenir y Metrovivienda, y casas de tradición en Bosa Centro. Coordinamos el ingreso con portería y llegamos puntuales para que la serenata sea sorpresa de verdad."],
  ["kennedy", "Kennedy", ["Castilla", "Timiza", "Américas", "Patio Bonito", "Kennedy Central"],
    "Kennedy es la localidad más grande del sur occidente y allí hacemos serenatas cada semana: apartamentos en Castilla y Américas, casas en Kennedy Central y Timiza, y salones de eventos para quinces y matrimonios."],
  ["fontibon", "Fontibón", ["Modelia", "Hayuelos", "Fontibón centro", "Salitre occidental"],
    "En Fontibón llevamos música a conjuntos de Hayuelos y Salitre occidental, a casas de Modelia y Fontibón centro y a empresas de la zona aeroportuaria que quieren un cierre de año con mariachi o banda."],
  ["engativa", "Engativá", ["Normandía", "Boyacá Real", "Álamos", "Minuto de Dios", "Garcés Navas"],
    "Engativá es de barrios familiares como Normandía, Boyacá Real, Garcés Navas y Minuto de Dios. Allí el plan típico es la serenata de cumpleaños o del Día de la Madre en la sala de la casa, con el mariachi tocando las favoritas."],
  ["suba", "Suba", ["Niza", "Colina Campestre", "La Gaitana", "Rincón", "Tibabuyes", "Suba centro"],
    "Suba es donde más nos piden serenatas en el norte: conjuntos de Colina Campestre y Niza, casas en La Gaitana, el Rincón y Tibabuyes, y salones de eventos para bodas y quinceaños."],
  ["barrios-unidos", "Barrios Unidos", ["7 de Agosto", "Polo Club", "La Castellana", "Los Alcázares"],
    "En Barrios Unidos tocamos en casas del 7 de Agosto y Los Alcázares, en apartamentos de La Castellana y Polo Club, y en restaurantes y salones del sector para aniversarios y cumpleaños."],
  ["teusaquillo", "Teusaquillo", ["Galerías", "Palermo", "La Soledad", "Ciudad Salitre", "Quinta Paredes"],
    "Teusaquillo tiene casas de ladrillo en La Soledad y Palermo, edificios en Galerías y Ciudad Salitre, y muchas oficinas. Es ideal para una serenata romántica en la noche o una sorpresa de cumpleaños en la empresa."],
  ["los-martires", "Los Mártires", ["Santa Isabel", "Ricaurte", "Paloquemao", "La Estanzuela"],
    "En Los Mártires llegamos a casas de Santa Isabel y Ricaurte y a negocios y bodegas del sector de Paloquemao para celebraciones de equipo, aniversarios del negocio y serenatas familiares."],
  ["antonio-narino", "Antonio Nariño", ["Restrepo", "Ciudad Jardín Sur", "Santander", "La Fragua"],
    "Antonio Nariño es de comercio y familia: el Restrepo, Ciudad Jardín Sur y Santander. Tocamos en casas, locales y salones para cumpleaños, aniversarios y fiestas de fin de año."],
  ["puente-aranda", "Puente Aranda", ["Ciudad Montes", "Primavera", "Galán", "Zona Industrial", "Trinidad Galán"],
    "Puente Aranda combina barrios residenciales como Ciudad Montes y Galán con la Zona Industrial. Hacemos serenatas en casa y también eventos corporativos en plantas y oficinas, con norteña o banda para el cierre de año."],
  ["la-candelaria", "La Candelaria", ["Centro histórico", "Chorro de Quevedo", "Egipto", "La Concordia"],
    "En La Candelaria la música en vivo combina con las casas coloniales, los hoteles boutique y los restaurantes del centro histórico: propuestas de matrimonio, cenas de aniversario y bienvenidas de turistas."],
  ["rafael-uribe-uribe", "Rafael Uribe Uribe", ["Quiroga", "Olaya", "Marco Fidel Suárez", "Diana Turbay"],
    "En Rafael Uribe Uribe tocamos en casas de Quiroga y Olaya y en salones de Marco Fidel Suárez y Diana Turbay. Son serenatas de cumpleaños, primeras comuniones y bodas con música para bailar."],
  ["ciudad-bolivar", "Ciudad Bolívar", ["Perdomo", "Arborizadora", "Meissen", "Candelaria La Nueva", "Madelena"],
    "Ciudad Bolívar es de celebraciones grandes en familia. Llegamos a casas y salones del Perdomo, Arborizadora, Madelena, Meissen y Candelaria La Nueva con mariachi, norteña o banda para que nadie se quede sin bailar."],
];

function list(b) {
  return `${b.slice(0, -1).join(", ")} y ${b[b.length - 1]}`;
}

function localidad([slug, name, barrios, local]) {
  const bs = list(barrios);
  return {
    slug,
    name,
    kind: "localidad",
    barrios,
    title: `Mariachis en ${name}, Bogotá · Serenatas a domicilio | Musicaenvivo.co`,
    description: `Mariachis, grupo norteño y banda en vivo en ${name} (${barrios.slice(0, 3).join(", ")}). Serenatas a domicilio, cumpleaños, bodas y eventos. Precios por paquete y reserva por WhatsApp.`,
    h1: `Mariachis y serenatas en ${name}`,
    intro: [
      local,
      `Escoge el formato: una serenata corta con mariachi, una hora de norteña para la fiesta o banda completa para un evento grande. Tú eliges las canciones y nosotros llegamos a la dirección en ${name} a la hora acordada.`,
    ],
    services: {
      mariachi: `Serenatas a domicilio en ${bs}: Las Mañanitas, rancheras, boleros y canciones románticas a pedido.`,
      nortena: `Grupo norteño en ${name} para fiestas en casa, asados y reuniones: corridos, cumbias norteñas y baladas.`,
      banda: `Banda en vivo con metales y percusión para bodas, quinces y eventos de empresa en ${name}.`,
    },
    occasions: `Serenatas de cumpleaños, aniversarios, Día de la Madre y del Padre, propuestas de matrimonio, bodas, quinceaños, grados, despedidas y fiestas de empresa en ${name}.`,
    faqs: [
      {
        q: `¿Cuánto cuesta un mariachi en ${name}?`,
        a: "El precio depende del paquete (número de canciones u horas de show) y puede sumar un recargo por desplazamiento según la distancia. Te damos el valor exacto por WhatsApp.",
      },
      {
        q: `¿Hacen serenatas a domicilio en ${barrios[0]} y ${barrios[1]}?`,
        a: `Sí. Llegamos a casas, apartamentos, conjuntos, restaurantes y oficinas de ${bs} y el resto de ${name}.`,
      },
      {
        q: "¿Puedo reservar una serenata para hoy?",
        a: "Si hay disponibilidad, sí. Escríbenos por WhatsApp con la hora y la dirección y te confirmamos en minutos. Para fechas especiales reserva con 24 a 48 horas.",
      },
    ],
  };
}

export const LOCALIDADES = L.map(localidad);
