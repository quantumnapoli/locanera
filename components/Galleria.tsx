"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";

import Reveal from "@/components/Reveal";
import { SITE } from "@/lib/site";

const FOTO = [
  { src: "/foto/sala.webp", alt: "La sala sotto le volte", wide: true },
  { src: "/foto/spina.webp", alt: "Spillatura al bancone" },
  { src: "/foto/burger-harp.webp", alt: "Burger e pinta di Harp" },
  { src: "/foto/oca-statua.webp", alt: "L'oca nera che veglia sul pub" },
  { src: "/foto/tagliata.webp", alt: "Tagliata di manzo irlandese" },
  { src: "/foto/guinness.webp", alt: "La spina Guinness con l'arpa" },
  { src: "/foto/amici.webp", alt: "Amici a tavola", wide: true },
  { src: "/foto/burger-gourmet.webp", alt: "Panino gourmet" },
  { src: "/foto/cartello.webp", alt: "La vita è troppo breve per bere cattiva birra" },
  { src: "/foto/tagliere.webp", alt: "Tagliere di salumi, formaggi e frutta" },
  { src: "/foto/hobgoblin.webp", alt: "Hobgoblin IPA" },
  { src: "/foto/jameson.webp", alt: "Cassa di Jameson Irish Whiskey" },
  { src: "/foto/dolce.webp", alt: "La vita è iniziata con un peccato di gola" },
  { src: "/foto/burger-pulled.webp", alt: "Panino con pulled pork" },
  { src: "/foto/fritti.webp", alt: "Fritturine e patate" },
  { src: "/foto/insegna.webp", alt: "L'insegna de L'Oca Nera" }
];

export default function Galleria() {
  const [open, setOpen] = useState<number | null>(null);

  const step = useCallback(
    (dir: 1 | -1) => setOpen((i) => (i === null ? i : (i + dir + FOTO.length) % FOTO.length)),
    []
  );

  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(null);
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, step]);

  return (
    <section id="galleria" className="relative scroll-mt-[var(--site-header-offset)] bg-brand-cream py-24 text-brand-black md:py-32">
      <div className="section-shell">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <Reveal>
            <span className="eyebrow">galleria / le nostre specialità</span>
            <h2 className="mt-6 text-[clamp(2.8rem,7vw,5.6rem)] leading-[0.92]">
              Vieni a vedere
              <br />
              com&apos;è da noi.
            </h2>
          </Reveal>
          <Reveal delay={0.08}>
            <a
              href={SITE.socials.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 rounded-full bg-brand-black px-7 py-4 font-label text-sm font-bold uppercase tracking-[0.22em] text-brand-gold transition hover:-translate-y-0.5"
            >
              @locanerapub
              <span aria-hidden="true">↗</span>
            </a>
          </Reveal>
        </div>

        <div className="mt-12 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
          {FOTO.map((foto, index) => (
            <Reveal key={foto.src} delay={(index % 4) * 0.05} className={foto.wide ? "col-span-2" : ""}>
              <button
                type="button"
                onClick={() => setOpen(index)}
                className={`group relative block w-full overflow-hidden rounded-[1.2rem] bg-brand-black ${
                  foto.wide ? "aspect-[2/1]" : "aspect-square"
                }`}
                aria-label={`Apri la foto: ${foto.alt}`}
              >
                <Image
                  src={foto.src}
                  alt={foto.alt}
                  fill
                  sizes={foto.wide ? "(min-width: 768px) 50vw, 100vw" : "(min-width: 768px) 25vw, 50vw"}
                  className="object-cover transition duration-700 group-hover:scale-[1.04]"
                />
                <span className="absolute inset-0 bg-brand-black/0 transition group-hover:bg-brand-black/15" />
              </button>
            </Reveal>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {open !== null && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={FOTO[open].alt}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[90] grid place-items-center bg-brand-black/95 p-4 backdrop-blur-md"
            onClick={() => setOpen(null)}
          >
            <motion.div
              key={open}
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="relative h-[min(82vh,82vw)] w-[min(82vh,92vw)]"
              onClick={(e) => e.stopPropagation()}
            >
              <Image src={FOTO[open].src} alt={FOTO[open].alt} fill sizes="92vw" className="object-contain" />
            </motion.div>
            <p className="absolute bottom-6 left-1/2 -translate-x-1/2 font-label text-sm uppercase tracking-[0.24em] text-white/70">
              {FOTO[open].alt}
            </p>
            {[
              { dir: -1 as const, label: "Foto precedente", icon: "←", pos: "left-4" },
              { dir: 1 as const, label: "Foto successiva", icon: "→", pos: "right-4" }
            ].map((b) => (
              <button
                key={b.dir}
                type="button"
                aria-label={b.label}
                onClick={(e) => {
                  e.stopPropagation();
                  step(b.dir);
                }}
                className={`absolute top-1/2 ${b.pos} grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full border border-white/20 text-white transition hover:border-brand-gold hover:text-brand-gold`}
              >
                {b.icon}
              </button>
            ))}
            <button
              type="button"
              aria-label="Chiudi"
              onClick={() => setOpen(null)}
              className="absolute right-4 top-4 grid h-11 w-11 place-items-center rounded-full border border-white/20 text-white transition hover:border-brand-gold hover:text-brand-gold"
            >
              ✕
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
