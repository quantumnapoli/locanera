import Image from "next/image";
import Link from "next/link";

import { LogoBadge } from "@/components/Logo";
import Reveal from "@/components/Reveal";
import { SITE } from "@/lib/site";

const heroStats = [
  { label: "Alla spina", value: "Guinness & co." },
  { label: "In cucina", value: "Carne irlandese" },
  { label: "Per finire", value: "Dolci home made" }
] as const;

// posizioni fisse: niente Math.random nel render, il markup resta stabile
const bubbles = [
  { left: "8%", size: 6, delay: "0s", duration: "11s" },
  { left: "17%", size: 3, delay: "3s", duration: "9s" },
  { left: "29%", size: 5, delay: "6s", duration: "13s" },
  { left: "41%", size: 4, delay: "1.5s", duration: "10s" },
  { left: "56%", size: 7, delay: "4s", duration: "14s" },
  { left: "68%", size: 3, delay: "7s", duration: "9.5s" },
  { left: "79%", size: 5, delay: "2s", duration: "12s" },
  { left: "91%", size: 4, delay: "5s", duration: "10.5s" }
];

export default function HeroIntro() {
  return (
    <section className="relative min-h-screen overflow-hidden bg-brand-black text-white">
      {/* la sala con le volte: fondale scuro, la scena la fa il testo */}
      <Image
        src="/foto/chi-siamo-pub.webp"
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover opacity-35"
      />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,#0a0a0a_0%,rgba(10,10,10,0.92)_38%,rgba(10,10,10,0.55)_70%,rgba(10,10,10,0.8)_100%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_45%,rgba(254,218,20,0.14),transparent_45%)]" />
      <div className="absolute inset-0 grain opacity-20" />

      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-full overflow-hidden">
        {bubbles.map((b) => (
          <span
            key={b.left}
            className="animate-bubble absolute -bottom-4 rounded-full bg-brand-cream/40"
            style={{ left: b.left, width: b.size, height: b.size, animationDelay: b.delay, animationDuration: b.duration }}
          />
        ))}
      </div>

      <div className="section-shell relative z-10 flex min-h-screen min-h-[100dvh] flex-col justify-center pb-10 pt-[max(8rem,calc(var(--site-header-offset)+1.5rem))] md:pt-36 lg:pt-40">
        <div className="grid items-center gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)]">
          <div className="max-w-[46rem]">
            <Reveal>
              <span className="eyebrow-dark">
                Irish Pub · {SITE.address.zone}, {SITE.address.city}
              </span>
            </Reveal>

            <Reveal delay={0.08}>
              <h1 className="mt-8 text-[clamp(3.4rem,10vw,8rem)] leading-[0.9] text-white">
                Un pò d&apos;Irlanda
                <br />
                nel cuore di <span className="text-brand-gold">Napoli.</span>
              </h1>
            </Reveal>

            <Reveal delay={0.14}>
              <p className="mt-6 max-w-[36rem] text-lg leading-relaxed text-white/75 md:text-[1.3rem]">
                Non un semplice pub, ma una <strong className="font-semibold text-white">Public House</strong>: un
                posto dove non troverai sconosciuti, solo buoni amici che non hai ancora avuto il piacere
                d&apos;incontrare.
              </p>
            </Reveal>

            <Reveal delay={0.18}>
              <div className="mt-9 flex flex-col gap-4 sm:flex-row">
                <Link href="#menu" className="btn-gold">
                  Sfoglia il menu
                </Link>
                <a href={SITE.phoneHref} className="btn-ghost">
                  Prenota un tavolo
                </a>
              </div>
            </Reveal>

            <Reveal delay={0.22}>
              <div className="mt-10 grid gap-4 sm:grid-cols-3">
                {heroStats.map((item) => (
                  <div key={item.label} className="rounded-[1.5rem] border border-white/12 bg-white/[0.05] px-5 py-5 backdrop-blur-xl">
                    <p className="font-label text-[11px] font-semibold uppercase tracking-[0.3em] text-brand-gold/80">
                      {item.label}
                    </p>
                    <p className="mt-2 font-display text-xl font-bold text-white">{item.value}</p>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>

          {/* Da lg in su la colonna resta vuota: la occupa il badge fisso
              (FloatingHeroBadge), guidato dal mouse. Sotto quella soglia il
              badge torna nel flusso e galleggia sul posto. */}
          <div className="relative mx-auto aspect-square w-full max-w-[20rem] animate-badge-land lg:hidden">
            <div className="pointer-events-none absolute inset-[-12%] rounded-full bg-brand-gold/15 blur-[70px]" />
            <div className="absolute inset-0 animate-float-badge drop-shadow-[0_40px_40px_rgba(0,0,0,0.6)] [will-change:transform]">
              <LogoBadge className="h-full w-full" priority sizes="80vw" />
            </div>
          </div>
        </div>

        <Reveal delay={0.28} className="mt-12 lg:mt-10">
          <div className="flex flex-col gap-3 border-t border-white/15 pt-6 font-label text-sm uppercase tracking-[0.28em] text-white/60 md:flex-row md:items-center md:justify-between">
            <p>{SITE.address.street} · {SITE.address.cap} {SITE.address.city}</p>
            <p className="text-brand-gold/80">Un&apos;ora di parcheggio Autovomero in regalo</p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
