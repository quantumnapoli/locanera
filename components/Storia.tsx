"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const capitoli = [
  {
    n: "01",
    eyebrow: "Irish Pub",
    titolo: "Il centro della vita quotidiana.",
    testo:
      "In Irlanda il pub è il punto di riferimento di ogni cittadino, il luogo di ritrovo per eccellenza. Volte in mattoni, bancone in legno, spine sempre pronte: quell'idea l'abbiamo portata al Vomero.",
    image: "/foto/chi-siamo-pub.webp",
    alt: "La sala de L'Oca Nera con le volte in mattoni e il bancone"
  },
  {
    n: "02",
    eyebrow: "Per i nostri clienti",
    titolo: "Carne irlandese.",
    testo:
      "Tra le carni più succulente sul mercato: ricca di vitamine, con un grasso dorato che la ricopre e la ammorbidisce in cottura. Entrecôte, tagliata e filetto, sempre con contorno a scelta.",
    image: "/foto/chi-siamo-carne.webp",
    alt: "Taglio di carne irlandese cruda con rosmarino e pepe rosa"
  },
  {
    n: "03",
    eyebrow: "I nostri dolci",
    titolo: "Un gesto d'amore, fatto in casa.",
    testo:
      "“L'arte di preparare dolci è molto più che saper eseguire ricette alla perfezione: è un vero e proprio gesto d'amore.” Cheesecake, panna cotta, torta dell'Oca, tutto home made.",
    image: "/foto/chi-siamo-dolci.webp",
    alt: "Cheesecake ai frutti di bosco"
  },
  {
    n: "04",
    eyebrow: "Il vessillo",
    titolo: "Dietro il nostro ci siete anche voi.",
    testo:
      "Lo storico vessillo rappresenta la rarità di un'oca con le piume completamente nere. Dietro c'è passione, amore, ideali, cultura, dedizione. E ci siete voi… millemila grazie.",
    image: "/foto/chi-siamo-oca.webp",
    alt: "L'insegna esterna de L'Oca Nera Pub"
  }
];

/**
 * Su desktop la sezione si blocca e i capitoli scorrono in orizzontale
 * guidati dallo scroll verticale. Su mobile restano una colonna normale.
 */
export default function Storia() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [shift, setShift] = useState(0);
  const [height, setHeight] = useState<number | undefined>(undefined);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    let raf = 0;
    const measure = () => {
      const track = trackRef.current;
      if (!track || !mq.matches) {
        setHeight(undefined);
        setShift(0);
        return;
      }
      const extra = track.scrollWidth - window.innerWidth;
      setHeight(window.innerHeight + Math.max(extra, 0));
    };
    const update = () => {
      raf = 0;
      const wrap = wrapRef.current;
      const track = trackRef.current;
      if (!wrap || !track || !mq.matches) return;
      const extra = track.scrollWidth - window.innerWidth;
      const r = wrap.getBoundingClientRect();
      const p = Math.min(Math.max(-r.top / Math.max(wrap.offsetHeight - window.innerHeight, 1), 0), 1);
      setShift(p * Math.max(extra, 0));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    const onResize = () => {
      measure();
      onScroll();
    };
    measure();
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section id="storia" className="relative bg-brand-ink text-white">
      <div ref={wrapRef} style={{ height }} className="relative">
        <div className="lg:sticky lg:top-0 lg:h-[100svh] lg:overflow-hidden">
          <div
            ref={trackRef}
            className="flex flex-col gap-16 py-24 lg:h-full lg:w-max lg:flex-row lg:items-center lg:gap-0 lg:py-0 [will-change:transform]"
            style={{ transform: `translate3d(${-shift}px,0,0)` }}
          >
            {/* copertina */}
            <div className="section-shell lg:w-[46vw] lg:max-w-none lg:shrink-0 lg:pl-16 lg:pr-8">
              <p className="font-label text-xs font-bold uppercase tracking-[0.34em] text-brand-gold">La nostra storia</p>
              <h2 className="mt-5 font-display text-[clamp(3rem,7vw,7.5rem)] font-black leading-[0.88]">
                Un pezzetto
                <br />
                d&apos;Irlanda,
                <br />
                <span className="text-brand-gold">in quattro</span>
                <br />
                capitoli.
              </h2>
              <p className="mt-8 hidden font-label text-xs font-bold uppercase tracking-[0.34em] text-white/40 lg:block">
                continua a scorrere →
              </p>
            </div>

            {capitoli.map((c, i) => (
              <article
                key={c.n}
                className="relative px-4 sm:px-6 lg:flex lg:h-full lg:w-[78vw] lg:shrink-0 lg:items-center lg:px-[4vw]"
              >
                <div className="relative w-full lg:h-[72vh]">
                  <div
                    className={`relative aspect-[4/3] w-full overflow-hidden lg:absolute lg:aspect-auto lg:h-full ${
                      i % 2 ? "lg:right-0" : "lg:left-0"
                    } lg:w-[62%]`}
                  >
                    <Image src={c.image} alt={c.alt} fill sizes="(min-width: 1024px) 48vw, 100vw" className="object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  </div>
                  <div
                    className={`relative mt-6 max-w-xl lg:absolute lg:bottom-[6%] lg:mt-0 lg:w-[46%] lg:bg-brand-ink lg:p-10 ${
                      i % 2 ? "lg:left-0" : "lg:right-0"
                    }`}
                  >
                    <span aria-hidden="true" className="block font-display text-[clamp(4rem,7vw,6.5rem)] font-black leading-[0.8] text-brand-gold">
                      {c.n}
                    </span>
                    <p className="mt-4 font-label text-xs font-bold uppercase tracking-[0.34em] text-brand-gold">{c.eyebrow}</p>
                    <h3 className="mt-3 font-display text-[clamp(2rem,3.4vw,3.4rem)] font-black leading-[0.98]">{c.titolo}</h3>
                    <p className="mt-5 text-lg leading-relaxed text-white/65">{c.testo}</p>
                  </div>
                </div>
              </article>
            ))}
            <div className="hidden lg:block lg:w-[6vw] lg:shrink-0" />
          </div>
        </div>
      </div>
    </section>
  );
}
