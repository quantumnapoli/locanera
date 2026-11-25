export type Panino = {
  slug: string;
  name: string;
  /** Numero sulla scheda, in romano */
  volume: string;
  image: string;
  /** Colore della scheda a scaffale */
  card: string;
  /** Colore del filetto/serigrafia sulla scheda */
  foil: string;
  /** Altezza relativa della scheda: rompe l'allineamento come i dorsi dei libri */
  height: number;
  tag: string;
  note: string;
  deck: string;
  price: number;
  ingredients: string[];
  meta: Record<string, string>;
};

const GOLD = "#feda14";
const BRASS = "#d9b45a";

/**
 * Selezione dei Panini Gourmet per lo scaffale. Nomi, ingredienti e prezzi
 * vengono dal menu ufficiale (dishcovery); le descrizioni brevi sono testi
 * nostri da far validare al locale.
 */
export const PANINI: Panino[] = [
  {
    slug: "oca-nera",
    name: "Oca Nera",
    volume: "I",
    image: "/menu/image_1694740225.webp",
    card: "#111111",
    foil: GOLD,
    height: 1.42,
    tag: "il panino di casa",
    note: "Bun al carbone vegetale, podolico e parmigiana di melanzane.",
    deck: "Porta il nome del pub e si vede: bun nero al carbone vegetale, hamburger di podolico e una parmigiana di melanzane che sa di domenica napoletana, chiusa da pesto e noci.",
    price: 11,
    ingredients: [
      "bun al carbone vegetale",
      "hamburger di podolico",
      "parmigiana di melanzane",
      "provola d'Agerola",
      "pesto di basilico",
      "noci"
    ],
    meta: { Carne: "Podolico", Bun: "Carbone vegetale", Firma: "Parmigiana dentro", Prezzo: "€ 11,00" }
  },
  {
    slug: "st-james",
    name: "St. James",
    volume: "II",
    image: "/menu/image_1684868805.webp",
    card: "#0f3b2e",
    foil: BRASS,
    height: 1.3,
    tag: "napoli incontra dublino",
    note: "Maialino nero, crema di friarielli e tarallo sbriciolato.",
    deck: "Maialino nero, provola crispy e crema di friarielli: un piede in Irlanda e uno a Napoli, con la sbriciolata di tarallo a fare rumore a ogni morso.",
    price: 11.5,
    ingredients: [
      "bun artigianale",
      "hamburger di maialino nero",
      "provola crispy",
      "crema di friarielli",
      "mayo ai 4 pepi",
      "songino",
      "tarallo napoletano"
    ],
    meta: { Carne: "Maialino nero", Bun: "Artigianale", Firma: "Tarallo sbriciolato", Prezzo: "€ 11,50" }
  },
  {
    slug: "nerone",
    name: "Nerone",
    volume: "III",
    image: "/menu/image_1684868755.webp",
    card: "#4a1010",
    foil: GOLD,
    height: 1.48,
    tag: "black bun",
    note: "Podolico, cheddar e bacon nel bun al carbone.",
    deck: "Il classico che non sbaglia, vestito di nero: podolico, cheddar fuso, bacon e patate fry & deep dentro il bun al carbone vegetale.",
    price: 12,
    ingredients: [
      "bun al carbone vegetale",
      "hamburger di podolico",
      "iceberg",
      "pomodoro",
      "cheddar",
      "bacon",
      "patate fry & deep"
    ],
    meta: { Carne: "Podolico", Bun: "Carbone vegetale", Firma: "Patate dentro", Prezzo: "€ 12,00" }
  },
  {
    slug: "murphy",
    name: "Murphy",
    volume: "IV",
    image: "/menu/image_1684868507.webp",
    card: "#2a2118",
    foil: BRASS,
    height: 1.24,
    tag: "brie & crudo",
    note: "Crudo, brie francese e melanzane grigliate.",
    deck: "Il gourmet più elegante del bancone: prosciutto crudo, brie francese che si scioglie sul podolico, melanzane grigliate e datterino giallo.",
    price: 11,
    ingredients: [
      "bun artigianale",
      "hamburger di podolico",
      "prosciutto crudo",
      "brie francese",
      "melanzane grigliate",
      "datterino giallo"
    ],
    meta: { Carne: "Podolico", Bun: "Artigianale", Firma: "Brie francese", Prezzo: "€ 11,00" }
  },
  {
    slug: "ston",
    name: "Ston",
    volume: "V",
    image: "/menu/image_1690265249.webp",
    card: "#1b2a3a",
    foil: GOLD,
    height: 1.36,
    tag: "piccante",
    note: "Podolico, pomodori secchi e provolone piccante.",
    deck: "Per chi chiede carattere: hamburger di podolico, pomodori secchi, provolone piccante e melanzane. Da accompagnare con una pinta scura.",
    price: 11,
    ingredients: ["bun artigianale", "hamburger di podolico", "pomodori secchi", "provolone piccante", "melanzane"],
    meta: { Carne: "Podolico", Bun: "Artigianale", Firma: "Provolone piccante", Prezzo: "€ 11,00" }
  },
  {
    slug: "charles",
    name: "Charles",
    volume: "VI",
    image: "/menu/image_1685467975.webp",
    card: "#3b2a0c",
    foil: GOLD,
    height: 1.28,
    tag: "pulled pork",
    note: "Pulled pork affumicato e cipolla di Tropea caramellata.",
    deck: "Pulled pork affumicato, cheddar e cipolla rossa di Tropea caramellata: dolce, affumicato, irresistibile.",
    price: 11,
    ingredients: [
      "bun artigianale",
      "pulled pork affumicato",
      "lattuga iceberg",
      "cheddar",
      "cipolla di Tropea caramellata"
    ],
    meta: { Carne: "Pulled pork", Bun: "Artigianale", Firma: "Affumicatura", Prezzo: "€ 11,00" }
  },
  {
    slug: "morticia",
    name: "Morticia",
    volume: "VII",
    image: "/menu/image_1685468694.webp",
    card: "#0d0d0d",
    foil: BRASS,
    height: 1.44,
    tag: "pistacchio di Bronte",
    note: "Maialino nero, mortadella croccante e pistacchio.",
    deck: "Maialino nero, provola di Agerola, mortadella croccante, petali di grana e granella di pistacchio di Bronte.",
    price: 10.5,
    ingredients: [
      "bun artigianale",
      "hamburger di maialino nero",
      "provola di Agerola",
      "mortadella croccante",
      "petali di grana",
      "pistacchio di Bronte"
    ],
    meta: { Carne: "Maialino nero", Bun: "Artigianale", Firma: "Pistacchio", Prezzo: "€ 10,50" }
  },
  {
    slug: "rory",
    name: "Rory",
    volume: "VIII",
    image: "/menu/image_1685470362.webp",
    card: "#183a1c",
    foil: GOLD,
    height: 1.22,
    tag: "vegetariano",
    note: "Burger di ceci e noce moscata, provolone del Monaco.",
    deck: "La scelta vegetariana che non fa rimpiangere niente: burger di ceci e noce moscata, provolone del Monaco, rucola e pomodoro.",
    price: 10,
    ingredients: ["bun artigianale", "hamburger di ceci e noce moscata", "provolone del Monaco", "rucola", "pomodoro"],
    meta: { Base: "Ceci", Bun: "Artigianale", Firma: "Provolone del Monaco", Prezzo: "€ 10,00" }
  }
];
