export type GenreId = "mariachi" | "nortena" | "banda";

export type PackageData = {
  id?: string;
  name: string;
  priceCop: number;
  durationMinutes: number;
  songsCount: number;
  musiciansCount: number;
  description: string;
  features: string[];
  popular: boolean;
  sortOrder: number;
  localImage: string;
  fallbackUrl: string;
  imagePath?: string | null;
  imageUrl?: string | null;
  genre?: GenreId | null;
};

export type GenreData = {
  id: GenreId;
  name: string;
  image: string;
};

export type GenreHourlyConfig = {
  rate: number;
  image?: string;
  description?: string;
};

export const HOURLY_MIN = 1;
export const HOURLY_MAX = 5;

export const DEFAULT_GENRES: GenreData[] = [
  { id: "mariachi", name: "Mariachi", image: "/images/mariachi-hero.jpg" },
  { id: "nortena", name: "Norteña", image: "/images/guitar.jpg" },
  { id: "banda", name: "Banda", image: "/images/trumpet.jpg" },
];

export const CITIES = ["Duitama", "Paipa", "Sogamoso"] as const;

export const TIME_SLOTS = [
  "6:00 PM",
  "7:00 PM",
  "8:00 PM",
  "9:00 PM",
  "10:00 PM",
  "11:00 PM",
] as const;

export const DEFAULT_PACKAGES: PackageData[] = [
  {
    name: "Serenata Básica",
    priceCop: 250_000,
    durationMinutes: 20,
    songsCount: 6,
    musiciansCount: 4,
    description:
      "La serenata perfecta para sorprender a esa persona especial con las canciones más románticas.",
    features: [
      "4 músicos profesionales",
      "6 canciones a elegir",
      "Traje típico de gala",
      "Repertorio clásico mexicano",
    ],
    popular: false,
    sortOrder: 1,
    localImage: "/images/guitar.jpg",
    fallbackUrl:
      "https://placehold.co/400x300/1a1a2e/d4af37?text=Serenata+B%C3%A1sica",
    genre: "mariachi",
  },
  {
    name: "Serenata Estándar",
    priceCop: 320_000,
    durationMinutes: 30,
    songsCount: 8,
    musiciansCount: 6,
    description:
      "Una experiencia inolvidable con un grupo completo de mariachis de primer nivel.",
    features: [
      "6 músicos profesionales",
      "8 canciones a elegir",
      "Traje de charro premium",
      "Arreglo de rosas incluido",
      "Repertorio personalizado",
    ],
    popular: true,
    sortOrder: 2,
    localImage: "/images/mariachi-hero.jpg",
    fallbackUrl:
      "https://placehold.co/400x300/1a1a2e/d4af37?text=Serenata+Est%C3%A1ndar",
    genre: "mariachi",
  },
  {
    name: "Gran Serenata de Lujo",
    priceCop: 380_000,
    durationMinutes: 40,
    songsCount: 12,
    musiciansCount: 8,
    description:
      "La experiencia más exclusiva: un espectáculo completo con el grupo de mariachis al completo.",
    features: [
      "8 músicos profesionales",
      "12 canciones a elegir",
      "Traje de charro de lujo",
      "Obsequio incluido",
      "Arreglo de rosas premium",
      "Video profesional incluido",
      "MC dedicado",
      "Repertorio 100% personalizado",
    ],
    popular: false,
    sortOrder: 3,
    localImage: "/images/trumpet.jpg",
    fallbackUrl:
      "https://placehold.co/400x300/1a1a2e/d4af37?text=Gran+Serenata",
    genre: "mariachi",
  },
];

export const TESTIMONIALS = [
  {
    name: "Carolina Méndez",
    city: "Duitama",
    text: "Fue la mejor sorpresa que le pude dar a mi esposo. Los mariachis llegaron puntual y tocaron increíble. ¡100% recomendados!",
    rating: 5,
  },
  {
    name: "Andrés Rodríguez",
    city: "Paipa",
    text: "Contraté la serenata estándar para el cumpleaños de mi mamá. Lloró de la emoción. Servicio de primera calidad.",
    rating: 5,
  },
  {
    name: "María Fernanda López",
    city: "Sogamoso",
    text: "Excelente servicio, muy profesionales. Las canciones fueron hermosas y el grupo tiene una energía increíble.",
    rating: 5,
  },
  {
    name: "Julián Pineda",
    city: "Tunja",
    text: "Pedí una Norteña para el aniversario de mis papás y quedamos fascinados. Los músicos súper amables y el sonido impecable.",
    rating: 5,
  },
  {
    name: "Daniela Suárez",
    city: "Nobsa",
    text: "Reservamos por WhatsApp y fue súper fácil. Llegaron a tiempo, se vistieron elegantes y se notó la experiencia. Gracias Musicaenvivo.",
    rating: 5,
  },
  {
    name: "Laura Camila Torres",
    city: "Tibasosa",
    text: "La banda sonó espectacular en el grado de mi hermano. Toda la familia bailó y la pasamos increíble. Volveremos a contratarlos.",
    rating: 5,
  },
  {
    name: "Jorge Iván Castillo",
    city: "Belén",
    text: "El detalle con mi esposa valió cada peso. Le tocaron sus canciones favoritas y quedó sin palabras. Servicio de primera.",
    rating: 5,
  },
  {
    name: "Paola Martínez",
    city: "Santa Rosa de Viterbo",
    text: "Le organicé la serenata sorpresa a mi novio y fue perfecto. Muy buena comunicación desde el primer mensaje.",
    rating: 5,
  },
  {
    name: "Sebastián Rivera",
    city: "Chiquinquirá",
    text: "Contratamos la Gran Serenata para el cumpleaños 60 de mi papá. Lloró de felicidad. Se nota el profesionalismo del grupo.",
    rating: 5,
  },
  {
    name: "Valentina Gómez",
    city: "Sogamoso",
    text: "Los contraté para la pedida de mano y todo salió mágico. Muy recomendados, puntuales y con mucho sentimiento al tocar.",
    rating: 5,
  },
  {
    name: "Camilo Herrera",
    city: "Paipa",
    text: "El sonido y la presentación de los músicos fueron espectaculares. Mi mamá no paraba de llorar de emoción.",
    rating: 5,
  },
  {
    name: "Luisa Jiménez",
    city: "Duitama",
    text: "Reservamos una Mariachi para el 15 de mi hija y fue el alma de la fiesta. Todos los invitados preguntaron por ustedes.",
    rating: 5,
  },
] as const;

export type ExtraItem = {
  id: string;
  name: string;
  price: string;
  icon: string;
  imageUrl?: string;
};

export const DEFAULT_EXTRAS: ExtraItem[] = [
  { id: "chocolates", name: "Caja de Chocolates", price: "35.000", icon: "🍫" },
  { id: "rosas", name: "Ramo de Rosas (12)", price: "45.000", icon: "🌹" },
  { id: "globos", name: "Globos Decorativos", price: "25.000", icon: "🎈" },
  { id: "peluche", name: "Peluche Grande", price: "40.000", icon: "🧸" },
  { id: "vino", name: "Botella de Vino", price: "55.000", icon: "🍷" },
  { id: "tarjeta", name: "Tarjeta Personalizada", price: "15.000", icon: "💌" },
];

/** @deprecated Use DEFAULT_EXTRAS; extras are loaded dynamically from site_settings. */
export const EXTRAS = DEFAULT_EXTRAS;

export const formatCop = (value: number): string =>
  value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
