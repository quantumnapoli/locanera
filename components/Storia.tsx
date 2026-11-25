import Image from "next/image";

import Reveal from "@/components/Reveal";

const capitoli = [
  {
    eyebrow: "Irish Pub",
    titolo: "Il centro nevralgico della vita quotidiana.",
    testo:
      "In Irlanda il pub è il punto di riferimento di ogni cittadino, il luogo di ritrovo per eccellenza. Le nostre volte in mattoni, il bancone in legno, le spine sempre pronte: abbiamo portato quell'idea a pochi passi da piazza Vanvitelli.",
    image: "/foto/chi-siamo-pub.webp",
    alt: "La sala de L'Oca Nera con le volte in mattoni e il bancone"
  },
  {
    eyebrow: "Per i nostri clienti",
    titolo: "Carne irlandese.",
    testo:
      "La carne di manzo irlandese è riconosciuta come una delle più succulente e appetitose sul mercato: ricca di vitamine, con un grasso dorato che la ricopre e la ammorbidisce in cottura. Entrecôte, tagliata e filetto, sempre con contorno a scelta.",
    image: "/foto/chi-siamo-carne.webp",
    alt: "Taglio di carne irlandese cruda con rosmarino e pepe rosa"
  },
  {
    eyebrow: "I nostri dolci",
    titolo: "Un gesto d'amore, fatto in casa.",
    testo:
      "“L'arte di preparare dolci è molto più che saper eseguire ricette alla perfezione: è un vero e proprio gesto d'amore.” Cheesecake, panna cotta, torta dell'Oca e tortino dal cuore caldo, tutti home made.",
    image: "/foto/chi-siamo-dolci.webp",
    alt: "Cheesecake ai frutti di bosco con biscotto"
  },
  {
    eyebrow: "L'Oca Nera",
    titolo: "Dietro un vessillo ci siete anche voi.",
    testo:
      "Lo storico vessillo, origine del nostro Irish Pub, rappresenta la rarità di un'oca con le piume completamente nere. Dietro un vessillo c'è passione, amore, ideali, cultura, dedizione. Dietro il nostro ci siete anche voi… millemila grazie.",
    image: "/foto/chi-siamo-oca.webp",
    alt: "L'insegna esterna de L'Oca Nera Pub con lo stemma"
  }
];

export default function Storia() {
  return (
    <section id="storia" className="relative scroll-mt-[var(--site-header-offset)] overflow-hidden bg-brand-ink py-24 text-white md:py-36">
      <div className="pointer-events-none absolute inset-0 select-none overflow-hidden">
        <span className="absolute -top-[4%] left-1/2 -translate-x-1/2 whitespace-nowrap font-display text-[clamp(8rem,24vw,20rem)] font-black leading-none text-white/[0.03]">
          L&apos;Oca Nera
        </span>
      </div>
      <div className="absolute inset-0 grain opacity-10" />

      <div className="section-shell relative grid gap-20 md:gap-28">
        {capitoli.map((c, index) => (
          <div
            key={c.eyebrow}
            className={`grid items-center gap-10 lg:gap-20 ${
              index % 2 ? "lg:grid-cols-[1fr_1.1fr]" : "lg:grid-cols-[1.1fr_1fr]"
            }`}
          >
            <Reveal className={index % 2 ? "lg:order-2" : ""}>
              <div className="gold-frame relative aspect-[3/2] w-full overflow-hidden rounded-sm">
                <Image src={c.image} alt={c.alt} fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
              </div>
            </Reveal>
            <Reveal delay={0.1} className={index % 2 ? "lg:order-1" : ""}>
              <span className="eyebrow-dark">{c.eyebrow}</span>
              <h2 className="mt-6 text-[clamp(2.2rem,4.6vw,4rem)] leading-[0.98]">{c.titolo}</h2>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/65">{c.testo}</p>
            </Reveal>
          </div>
        ))}
      </div>
    </section>
  );
}
