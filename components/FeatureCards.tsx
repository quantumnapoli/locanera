"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { CARD_ICONS, type CardIconName } from "@/components/CardIcons";

export type FeatureCard = {
  numero: string;
  titolo: string;
  testo: string;
  icona: CardIconName;
};

type Props = {
  cards: FeatureCard[];
  /** chiaro = fondo crema, scuro = fondo nero */
  tone?: "light" | "dark";
  className?: string;
};

const TONE = {
  light: {
    shell:
      "border-brand-black/10 bg-white/90 shadow-[0_26px_60px_-32px_rgba(10,10,10,0.45)]",
    numero: "text-brand-black/10",
    titolo: "text-brand-black",
    testo: "text-brand-black/70",
    icon: "border-brand-black/10 bg-brand-gold text-brand-black",
    rule: "bg-brand-black/10",
    glow: "rgba(254,218,20,0.35)"
  },
  dark: {
    shell: "border-white/10 bg-white/[0.045] shadow-[0_30px_70px_-40px_rgba(0,0,0,0.9)]",
    numero: "text-white/[0.09]",
    titolo: "text-white",
    testo: "text-white/55",
    icon: "border-brand-gold/25 bg-brand-gold/10 text-brand-gold",
    rule: "bg-white/10",
    glow: "rgba(254,218,20,0.18)"
  }
} as const;

/**
 * Blocchi a tre come card autonome: entrata in scena con GSAP (stagger +
 * rotazione sull'asse X) e inclinazione 3D che segue il puntatore, con i
 * contenuti su piani diversi cosi la profondita si legge davvero.
 */
export default function FeatureCards({ cards, tone = "light", className }: Props) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const palette = TONE[tone];

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const items = Array.from(root.querySelectorAll<HTMLElement>("[data-card]"));

    const ctx = gsap.context(() => {
      if (reduceMotion) {
        gsap.set(items, { opacity: 1, y: 0, rotateX: 0 });
        return;
      }

      gsap.registerPlugin(ScrollTrigger);
      gsap.from(items, {
        opacity: 0,
        y: 64,
        rotateX: -14,
        scale: 0.94,
        duration: 0.9,
        ease: "power3.out",
        stagger: 0.12,
        scrollTrigger: { trigger: root, start: "top 82%", once: true }
      });

      items.forEach((card) => {
        const icon = card.querySelector<HTMLElement>("[data-icon]");
        if (!icon) return;
        gsap.to(icon, {
          y: -6,
          duration: 2.6,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
          delay: Math.random() * 1.2
        });
      });
    }, root);

    if (reduceMotion) return () => ctx.revert();

    // inclinazione 3D: un quickTo per proprieta tiene il movimento fluido
    const cleanups = items.map((card) => {
      const inner = card.querySelector<HTMLElement>("[data-inner]");
      const glow = card.querySelector<HTMLElement>("[data-glow]");
      if (!inner) return () => {};

      const rotX = gsap.quickTo(inner, "rotateX", { duration: 0.5, ease: "power3.out" });
      const rotY = gsap.quickTo(inner, "rotateY", { duration: 0.5, ease: "power3.out" });
      const lift = gsap.quickTo(inner, "y", { duration: 0.5, ease: "power3.out" });

      const onMove = (event: PointerEvent) => {
        const rect = card.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width - 0.5;
        const y = (event.clientY - rect.top) / rect.height - 0.5;
        rotY(x * 13);
        rotX(-y * 13);
        lift(-8);
        if (glow) {
          glow.style.opacity = "1";
          glow.style.background = `radial-gradient(20rem circle at ${
            (x + 0.5) * 100
          }% ${(y + 0.5) * 100}%, ${palette.glow}, transparent 62%)`;
        }
      };

      const onLeave = () => {
        rotX(0);
        rotY(0);
        lift(0);
        if (glow) glow.style.opacity = "0";
      };

      card.addEventListener("pointermove", onMove);
      card.addEventListener("pointerleave", onLeave);
      return () => {
        card.removeEventListener("pointermove", onMove);
        card.removeEventListener("pointerleave", onLeave);
      };
    });

    return () => {
      cleanups.forEach((fn) => fn());
      ctx.revert();
    };
  }, [palette.glow]);

  return (
    <div
      ref={rootRef}
      className={`grid gap-6 md:grid-cols-3 ${className ?? ""}`}
      style={{ perspective: "1400px" }}
    >
      {cards.map((card) => {
        const Icon = CARD_ICONS[card.icona];
        return (
          <div key={card.numero} data-card className="[transform-style:preserve-3d]">
            <article
              data-inner
              className={`relative flex h-full flex-col overflow-hidden rounded-[2rem] border p-8 [transform-style:preserve-3d] md:p-9 ${palette.shell}`}
            >
              <div
                data-glow
                className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500"
              />

              <div className="relative flex items-start justify-between gap-6 [transform:translateZ(38px)]">
                <span
                  data-icon
                  className={`grid h-14 w-14 shrink-0 place-items-center rounded-2xl border ${palette.icon}`}
                >
                  <Icon className="h-8 w-8" />
                </span>
                <span
                  className={`font-display text-[3.6rem] font-black leading-none ${palette.numero}`}
                >
                  {card.numero}
                </span>
              </div>

              <h3
                className={`relative mt-8 text-[1.8rem] leading-[1.05] [transform:translateZ(26px)] ${palette.titolo}`}
              >
                {card.titolo}
              </h3>

              <div className={`relative mt-5 h-px w-full [transform:translateZ(14px)] ${palette.rule}`} />

              <p
                className={`relative mt-5 text-base leading-relaxed [transform:translateZ(14px)] ${palette.testo}`}
              >
                {card.testo}
              </p>
            </article>
          </div>
        );
      })}
    </div>
  );
}
