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
    <article className="group flex gap-4 rounded-[1.4rem] border border-white/8 bg-white/[0.03] p-3 transition hover:border-brand-gold/40 hover:bg-white/[0.06] sm:p-4">
      {item.image && (
        <div className="relative aspect-square w-20 shrink-0 overflow-hidden rounded-xl bg-brand-ink sm:w-24">
          <Image
            src={item.image}
            alt={item.name}
            fill
            sizes="96px"
            className="object-cover transition duration-500 group-hover:scale-105"
          />
        </div>
      )}
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline justify-between gap-3">
          <h4 className="font-display text-lg font-bold leading-tight text-white">{item.name}</h4>
          {item.price !== null && (
            <span className="shrink-0 font-label text-base font-bold tabular-nums text-brand-gold">
              {formatPrice(item.price)}
            </span>
          )}
        </div>
        {details && <p className="mt-1.5 text-sm leading-relaxed text-white/60">{details}</p>}
        {item.allergens.length > 0 && (
          <p className="mt-2 font-label text-[11px] uppercase tracking-[0.18em] text-white/35">
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
            <span className="eyebrow-dark">menu / cucina &amp; bancone</span>
            <h2 className="mt-6 text-[clamp(2.8rem,7vw,5.6rem)] leading-[0.92]">
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
                <div className="flex items-baseline gap-4 border-b border-white/10 pb-3">
                  <h3 className="text-[clamp(1.6rem,3vw,2.4rem)] leading-none text-white">
                    {section.title ?? active.name}
                  </h3>
                  {section.title && (
                    <span className="font-label text-xs uppercase tracking-[0.28em] text-white/40">{active.name}</span>
                  )}
                </div>
                <div className="mt-5 grid gap-3 md:grid-cols-2">
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
