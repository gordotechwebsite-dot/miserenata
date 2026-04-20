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
};

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
] as const;

export const EXTRAS = [
  { id: "chocolates", name: "Caja de Chocolates", price: "35.000", icon: "🍫" },
  { id: "rosas", name: "Ramo de Rosas (12)", price: "45.000", icon: "🌹" },
  { id: "globos", name: "Globos Decorativos", price: "25.000", icon: "🎈" },
  { id: "peluche", name: "Peluche Grande", price: "40.000", icon: "🧸" },
  { id: "vino", name: "Botella de Vino", price: "55.000", icon: "🍷" },
  { id: "tarjeta", name: "Tarjeta Personalizada", price: "15.000", icon: "💌" },
] as const;

export const formatCop = (value: number): string =>
  value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
