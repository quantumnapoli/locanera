/** Dati del locale, presi dal sito attuale (eatbu / dish.co). */
export const SITE = {
  name: "L'Oca Nera",
  fullName: "L'Oca Nera Irish Pub",
  tagline: "Un pò di Irlanda nel cuore di Napoli",
  phone: "+39 081 558 1649",
  phoneHref: "tel:+390815581649",
  email: "locanerapub@gmail.com",
  address: {
    street: "Via Gian Lorenzo Bernini, 17",
    cap: "80129",
    city: "Napoli",
    zone: "Vomero"
  },
  mapsUrl: "https://www.google.com/maps/search/?api=1&query=Via+Gian+Lorenzo+Bernini+17+80129+Napoli",
  mapsEmbed: "https://www.google.com/maps?q=L'Oca+Nera+Irish+Pub,+Via+Gian+Lorenzo+Bernini+17,+80129+Napoli&output=embed",
  menuUrl: "https://disv.it/OcaNera",
  socials: {
    instagram: "https://www.instagram.com/locanerapub/",
    facebook: "https://www.facebook.com/locanerapub/"
  },
  piva: "10007041212",
  parcheggio: "Ti aspettiamo e ti regaliamo un'ora al parcheggio Autovomero!",
  /**
   * Il sito attuale non pubblica gli orari (mostra solo "Siamo chiusi /
   * Cucina aperta"). Da compilare con il locale: finché è null il sito
   * invita a chiamare.
   */
  orari: null as null | { giorno: string; ore: string }[]
};

export const SERVIZI = [
  "Consegna a domicilio",
  "Tavoli all'aperto",
  "Eventi privati",
  "Take away",
  "Wi-Fi gratuito",
  "Animali ammessi"
];

export const PAGAMENTI = [
  "Contanti",
  "Contactless",
  "Visa",
  "Mastercard",
  "Maestro",
  "American Express",
  "Apple Pay",
  "Carta di debito"
];
