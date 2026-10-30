export type Flavor = {
  id: string;
  name: string;
  short: string;
  heat: number; // 1-5
  scoville: string;
  sauce: string; // sauce colour inside the jar
  accent: string; // label / UI accent
  notes: string[];
  pairing: string;
  description: string;
};

export const flavors: Flavor[] = [
  {
    id: "habanero",
    name: "Habanero Ahumado",
    short: "Habanero",
    heat: 4,
    scoville: "120.000 SHU",
    sauce: "#ff4a0f",
    accent: "#ff5b14",
    notes: ["Habanero naranja", "Chipotle mora", "Miel de caña"],
    pairing: "Tacos al pastor, costillas a la brasa, pizza napolitana",
    description:
      "Habaneros madurados al sol y ahumados 72 horas sobre leña de nogal. Un golpe frutal que se convierte en brasa lenta.",
  },
  {
    id: "ajo-negro",
    name: "Ajo Negro & Miso",
    short: "Ajo Negro",
    heat: 1,
    scoville: "2.500 SHU",
    sauce: "#3a1d10",
    accent: "#ffb341",
    notes: ["Ajo negro fermentado", "Miso de cebada", "Vinagre de arroz"],
    pairing: "Ramen, huevos poché, setas a la plancha",
    description:
      "Cuarenta días de fermentación convierten el ajo en caramelo umami. Profunda, untuosa, casi balsámica.",
  },
  {
    id: "mango",
    name: "Mango Picante",
    short: "Mango",
    heat: 3,
    scoville: "45.000 SHU",
    sauce: "#ffa012",
    accent: "#ffc94a",
    notes: ["Mango Ataulfo", "Chile serrano", "Lima kaffir"],
    pairing: "Ceviche, pescado a la parrilla, bowls tropicales",
    description:
      "Mango maduro, serrano fresco y un final cítrico que despierta. Tropical, brillante y peligrosamente adictiva.",
  },
  {
    id: "rocoto",
    name: "Rocoto Infernal",
    short: "Rocoto",
    heat: 5,
    scoville: "350.000 SHU",
    sauce: "#c4160d",
    accent: "#ff3b1f",
    notes: ["Rocoto rojo", "Carolina reaper", "Pimienta de Sichuan"],
    pairing: "Para valientes. Gotas, no cucharadas.",
    description:
      "Nuestra salsa más extrema. Rocoto andino y reaper equilibrados con pimienta de Sichuan que adormece y vuelve a encender.",
  },
];

export type Product = {
  id: string;
  name: string;
  subtitle: string;
  price: number;
  size: string;
  flavorIndex: number;
  tag?: string;
};

export const products: Product[] = [
  { id: "p-habanero", name: "Habanero Ahumado", subtitle: "Salsa de autor", price: 14.9, size: "250 ml", flavorIndex: 0, tag: "Más vendida" },
  { id: "p-ajo", name: "Ajo Negro & Miso", subtitle: "Salsa umami", price: 16.5, size: "250 ml", flavorIndex: 1 },
  { id: "p-mango", name: "Mango Picante", subtitle: "Salsa tropical", price: 13.9, size: "250 ml", flavorIndex: 2, tag: "Nueva" },
  { id: "p-rocoto", name: "Rocoto Infernal", subtitle: "Edición extrema", price: 18.9, size: "150 ml", flavorIndex: 3, tag: "Nivel 5" },
  { id: "p-trilogia", name: "Trilogía de Fuego", subtitle: "Habanero · Mango · Rocoto", price: 42, size: "3 × 150 ml", flavorIndex: 0, tag: "Pack" },
  { id: "p-reserva", name: "Reserva Negra", subtitle: "Barrica de roble · 1.200 uds", price: 29, size: "200 ml", flavorIndex: 1, tag: "Limitada" },
];

export type Ingredient = {
  name: string;
  origin: string;
  metric: string;
  metricLabel: string;
  color: string;
  description: string;
};

export const ingredients: Ingredient[] = [
  { name: "Chile Habanero", origin: "Yucatán, México", metric: "72h", metricLabel: "ahumado en nogal", color: "#ff5b14", description: "Cosechado a mano en su punto exacto de madurez naranja." },
  { name: "Ajo Negro", origin: "Las Pedroñeras, España", metric: "40d", metricLabel: "de fermentación", color: "#4a2a17", description: "Cabezas enteras maduradas a baja temperatura hasta volverse dulces." },
  { name: "Mango Ataulfo", origin: "Chiapas, México", metric: "18°", metricLabel: "brix de dulzor", color: "#ffb341", description: "Pulpa sin fibra, perfumada, recogida en su punto más dulce." },
  { name: "Rocoto Rojo", origin: "Arequipa, Perú", metric: "5/5", metricLabel: "nivel de fuego", color: "#d7261e", description: "Carnoso y feroz, con semillas negras y un picor que crece." },
  { name: "Miel de Caña", origin: "Frigiliana, España", metric: "1", metricLabel: "último trapiche", color: "#a8551b", description: "Melaza artesanal que redondea el ahumado con notas tostadas." },
  { name: "Lima Kaffir", origin: "Chanthaburi, Tailandia", metric: "0", metricLabel: "conservantes", color: "#c8d13a", description: "Hojas y piel que aportan un final cítrico casi floral." },
];
