"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";

import { SITE } from "@/lib/site";

const FOTO = [
  { src: "/foto/sala.webp", alt: "La sala sotto le volte" },
  { src: "/foto/spina.webp", alt: "Spillatura al bancone" },
  { src: "/foto/burger-harp.webp", alt: "Burger e pinta di Harp" },
  { src: "/foto/oca-statua.webp", alt: "L'oca nera che veglia sul pub" },
  { src: "/foto/tagliata.webp", alt: "Tagliata di manzo irlandese" },
  { src: "/foto/guinness.webp", alt: "La spina Guinness con l'arpa" },
  { src: "/foto/amici.webp", alt: "Amici a tavola" },
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

const RIGHE = [FOTO.slice(0, 8), FOTO.slice(8)];

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
    <section id="galleria" className="relative overflow-hidden bg-brand-black py-24 text-white md:py-32">
      <div className="section-shell flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <h2 className="font-display text-[clamp(3rem,8vw,7.5rem)] font-black leading-[0.86]">
          Dal nostro
          <br />
          <span className="text-brand-gold">Instagram.</span>
        </h2>
        <a
          href={SITE.socials.instagram}
          target="_blank"
          rel="noopener noreferrer"
          className="group inline-flex items-center gap-4 self-start font-display text-2xl font-black md:self-end"
        >
          @locanerapub
          <span className="grid h-12 w-12 place-items-center rounded-full bg-brand-gold text-brand-black transition group-hover:rotate-45">
            ↗
          </span>
        </a>
      </div>

      <div className="mt-14 grid gap-4 md:gap-6">
        {RIGHE.map((riga, r) => (
          <div key={r} className="group/row flex w-max gap-4 md:gap-6" >
            <div
              className={`flex gap-4 md:gap-6 ${r ? "animate-[marquee_60s_linear_infinite_reverse]" : "animate-[marquee_55s_linear_infinite]"} group-hover/row:[animation-play-state:paused] motion-reduce:animate-none`}
            >
              {[...riga, ...riga].map((foto, i) => {
                const index = FOTO.indexOf(foto);
                return (
                  <button
                    key={`${foto.src}-${i}`}
                    type="button"
                    onClick={() => setOpen(index)}
                    aria-label={`Apri la foto: ${foto.alt}`}
                    tabIndex={i >= riga.length ? -1 : 0}
                    className={`group relative aspect-square w-[58vw] shrink-0 overflow-hidden rounded-sm sm:w-[34vw] md:w-[22vw] lg:w-[17vw] ${
                      i % 2 ? "rotate-[1.5deg]" : "-rotate-[1.5deg]"
                    } transition duration-500 hover:z-10 hover:rotate-0 hover:scale-[1.06]`}
                  >
                    <Image src={foto.src} alt={foto.alt} fill sizes="(min-width: 1024px) 17vw, 58vw" className="object-cover" />
                  </button>
                );
              })}
            </div>
          </div>
        ))}
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
              initial={{ scale: 0.94, opacity: 0, rotate: -2 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              className="relative h-[min(82vh,82vw)] w-[min(82vh,92vw)]"
              onClick={(e) => e.stopPropagation()}
            >
              <Image src={FOTO[open].src} alt={FOTO[open].alt} fill sizes="92vw" className="object-contain" />
            </motion.div>
            <p className="absolute bottom-6 left-1/2 -translate-x-1/2 text-center font-label text-sm uppercase tracking-[0.24em] text-white/70">
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
                className={`absolute top-1/2 ${b.pos} grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-brand-gold text-brand-black transition hover:scale-110`}
              >
                {b.icon}
              </button>
            ))}
            <button
              type="button"
              aria-label="Chiudi"
              onClick={() => setOpen(null)}
              className="absolute right-4 top-4 grid h-11 w-11 place-items-center rounded-full border border-white/30 text-white transition hover:border-brand-gold hover:text-brand-gold"
            >
              ✕
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
