"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useMemo, useState } from "react";

import Reveal from "@/components/Reveal";
import { MENU, formatPrice, slugify, type MenuItem } from "@/lib/menu";
import { SITE } from "@/lib/site";

type Side = "cucina" | "bar";

function Item({ item }: { item: MenuItem }) {
  const details = item.desc || item.ingredients.join(", ");
  return (
    <article className="group flex gap-4 border-b border-white/10 py-5">
      {item.image && (
        <div className="relative aspect-square w-16 shrink-0 overflow-hidden rounded-full bg-brand-ink ring-2 ring-transparent transition group-hover:ring-brand-gold sm:w-20">
          <Image src={item.image} alt={item.name} fill sizes="80px" className="object-cover transition duration-500 group-hover:scale-110" />
        </div>
      )}
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline gap-3">
          <h4 className="font-display text-xl font-black leading-tight text-white transition group-hover:text-brand-gold">
            {item.name}
          </h4>
          <span aria-hidden="true" className="mb-1 flex-1 border-b-2 border-dotted border-white/20" />
          {item.price !== null && (
            <span className="shrink-0 font-display text-xl font-black tabular-nums text-brand-gold">
              {formatPrice(item.price)}
            </span>
          )}
        </div>
        {details && <p className="mt-1.5 max-w-[60ch] text-[15px] leading-relaxed text-white/55">{details}</p>}
        {item.allergens.length > 0 && (
          <p className="mt-1.5 font-label text-[11px] uppercase tracking-[0.18em] text-white/30">
            Allergeni: {item.allergens.join(", ")}
          </p>
        )}
      </div>
    </article>
  );
}

export default function MenuSection() {
  const [side, setSide] = useState<Side>("cucina");
  const groups = useMemo(() => MENU.filter((g) => g.drink === (side === "bar")), [side]);
  const [selected, setSelected] = useState<string>(slugify(MENU[0].name));

  const active = groups.find((g) => slugify(g.name) === selected) ?? groups[0];

  const switchSide = (next: Side) => {
    setSide(next);
    const first = MENU.find((g) => g.drink === (next === "bar"));
    if (first) setSelected(slugify(first.name));
  };

  return (
    <section id="menu" className="relative scroll-mt-[var(--site-header-offset)] bg-brand-black py-24 text-white md:py-32">
      <div className="absolute inset-0 grain opacity-10" />
      <div className="section-shell relative">
        <div className="grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end">
          <Reveal>
            <p className="font-label text-xs font-bold uppercase tracking-[0.34em] text-brand-gold">Menu · cucina &amp; bancone</p>
            <h2 className="mt-5 text-[clamp(3rem,8vw,7.5rem)] leading-[0.86]">
              Il menu
              <br />
              <span className="text-brand-gold">dell&apos;Oca.</span>
            </h2>
          </Reveal>

          <Reveal delay={0.08}>
            <div
              role="tablist"
              aria-label="Cucina o bancone"
              className="inline-flex rounded-full border border-white/12 bg-white/[0.04] p-1.5"
            >
              {(["cucina", "bar"] as const).map((key) => (
                <button
                  key={key}
                  role="tab"
                  type="button"
                  aria-selected={side === key}
                  onClick={() => switchSide(key)}
                  className={`rounded-full px-6 py-3 font-label text-sm font-bold uppercase tracking-[0.24em] transition ${
                    side === key ? "bg-brand-gold text-brand-black" : "text-white/65 hover:text-white"
                  }`}
                >
                  {key === "cucina" ? "Cucina" : "Birre & Drink"}
                </button>
              ))}
            </div>
          </Reveal>
        </div>

        {/* categorie: riga scorrevole su mobile, a capo da desktop */}
        <div className="no-scrollbar -mx-4 mt-10 flex gap-2 overflow-x-auto px-4 pb-2 sm:mx-0 sm:flex-wrap sm:px-0">
          {groups.map((group) => {
            const id = slugify(group.name);
            const isActive = id === slugify(active.name);
            return (
              <button
                key={id}
                type="button"
                onClick={() => setSelected(id)}
                aria-pressed={isActive}
                className={`shrink-0 rounded-full border px-4 py-2 font-label text-[13px] font-semibold uppercase tracking-[0.16em] transition ${
                  isActive
                    ? "border-brand-gold bg-brand-gold/10 text-brand-gold"
                    : "border-white/12 text-white/60 hover:border-white/30 hover:text-white"
                }`}
              >
                {group.name}
              </button>
            );
          })}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={active.name}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="mt-10 grid gap-12"
          >
            {active.sections.map((section, index) => (
              <div key={section.title ?? index}>
                <div className="flex items-baseline gap-4 border-b-2 border-brand-gold pb-3">
                  <h3 className="text-[clamp(2rem,4vw,3.4rem)] leading-none text-white">
                    {section.title ?? active.name}
                  </h3>
                  {section.title && (
                    <span className="font-label text-xs uppercase tracking-[0.28em] text-white/40">{active.name}</span>
                  )}
                </div>
                <div className="mt-2 grid gap-x-12 md:grid-cols-2">
                  {section.items.map((item) => (
                    <Item key={`${item.name}-${item.price}`} item={item} />
                  ))}
                </div>
              </div>
            ))}
          </motion.div>
        </AnimatePresence>

        <div className="mt-12 flex flex-col gap-5 border-t border-white/10 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-2xl text-sm leading-relaxed text-white/45">
            * Alcuni piatti possono contenere ingredienti surgelati o abbattuti. Per allergie e intolleranze chiedi
            al personale. Prezzi e disponibilità possono variare: fa fede il menu in sala.
          </p>
          <a href={SITE.menuUrl} target="_blank" rel="noopener noreferrer" className="btn-ghost shrink-0">
            Menu digitale
            <span aria-hidden="true">↗</span>
          </a>
        </div>
      </div>
    </section>
  );
}
