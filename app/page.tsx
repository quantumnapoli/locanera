import Link from "next/link";

import Contatti from "@/components/Contatti";
import FeatureCards from "@/components/FeatureCards";
import FloatingHeroBadge from "@/components/FloatingHeroBadge";
import Galleria from "@/components/Galleria";
import HeroIntro from "@/components/HeroIntro";
import { LogoBadge, Wordmark } from "@/components/Logo";
import MenuSection from "@/components/MenuSection";
import PaniniShelf from "@/components/PaniniShelf";
import Presentazione from "@/components/Presentazione";
import Reveal from "@/components/Reveal";
import SiteHeader from "@/components/SiteHeader";
import Storia from "@/components/Storia";
import { SITE } from "@/lib/site";

const tickerItems = [
  "guinness alla spina",
  "carne irlandese",
  "panini gourmet",
  "dolci home made",
  "whisky & gin",
  "public house",
  "vomero · napoli"
];

export default function Home() {
  return (
    <main className="[overflow-x:clip] bg-brand-black text-white">
      <SiteHeader />

      <FloatingHeroBadge />

      <HeroIntro />

      <Presentazione />

      <PaniniShelf />

      <section aria-hidden="true" className="overflow-hidden border-y border-brand-black bg-brand-gold py-4">
        <div className="flex min-w-max gap-10 whitespace-nowrap font-display text-[2.2rem] font-black text-brand-black animate-marquee">
          {[...tickerItems, ...tickerItems].map((item, index) => (
            <span key={`${item}-${index}`} className="flex items-center gap-10">
              {item}
              <span className="text-brand-orange">✦</span>
            </span>
          ))}
        </div>
      </section>

      <Storia />

      <MenuSection />

      {/* SEZIONE: al bancone — energia gialla */}
      <section className="relative overflow-hidden bg-brand-gold py-28 text-brand-black md:py-40">
        <div className="pointer-events-none absolute inset-x-0 -top-[6%] flex justify-center select-none overflow-hidden">
          <span className="font-display text-[clamp(10rem,32vw,26rem)] font-black leading-none text-brand-black/[0.06]">
            Sláinte
          </span>
        </div>
        <div className="absolute inset-0 grain opacity-15" />

        <div className="section-shell relative">
          <div className="grid gap-14 lg:grid-cols-2 lg:items-end">
            <Reveal>
              <span className="eyebrow border-brand-black/20 bg-brand-black/5">al bancone / sláinte!</span>
              <h2 className="mt-8 text-[clamp(3.2rem,9vw,7.5rem)] leading-[0.88]">
                La vita è troppo breve per bere cattiva birra.
              </h2>
            </Reveal>

            <Reveal delay={0.1}>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: "Birre alla spina", value: "11" },
                  { label: "Whisky", value: "11" },
                  { label: "Gin selezionati", value: "6" },
                  { label: "Rum", value: "11" }
                ].map((item) => (
                  <div key={item.label} className="rounded-[1.6rem] border border-brand-black/15 bg-white/30 p-6 backdrop-blur-xl">
                    <p className="font-label text-[11px] font-bold uppercase tracking-[0.3em] text-brand-black/60">{item.label}</p>
                    <p className="mt-2 font-display text-5xl font-black">{item.value}</p>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>

          <FeatureCards
            tone="light"
            className="mt-16"
            cards={[
              {
                numero: "01",
                icona: "pinta",
                titolo: "Guinness & co.",
                testo:
                  "Guinness Draught, Tennent's Super, Goose Island IPA, Bass, Leffe, Jupiler, Riegele e la birra del mese: tutte alla spina, in due misure."
              },
              {
                numero: "02",
                icona: "stella",
                titolo: "Whisky irlandese",
                testo:
                  "Jameson, Bushmills 10 anni, Silkie Midnight, i torbati di Islay e le selezioni Berry Bros & Rudd. Da bere lisci, con calma."
              },
              {
                numero: "03",
                icona: "vessillo",
                titolo: "Componi il tuo gin tonic",
                testo:
                  "Gin irlandesi e italiani, dall'An Dulaman alle alghe del Donegal a U Mauru, con quattro toniche Franklin a scelta. Poi la trilogia del Negroni."
              }
            ]}
          />

          <Reveal delay={0.12}>
            <div className="mt-14 flex flex-col gap-5 border-t border-brand-black/20 pt-10 sm:flex-row sm:items-center sm:justify-between">
              <p className="max-w-[44ch] text-lg leading-relaxed text-brand-black/80">
                Consegna a domicilio, take away o un tavolo sotto le volte. Per eventi privati chiamaci: ci pensiamo noi.
              </p>
              <Link
                href="#contatti"
                className="inline-flex shrink-0 items-center gap-3 rounded-full bg-brand-black px-8 py-4 font-label text-sm font-bold uppercase tracking-[0.24em] text-brand-gold transition hover:-translate-y-0.5"
              >
                Prenota un tavolo
                <span aria-hidden="true">→</span>
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      <Galleria />

      <Contatti />

      <footer className="border-t border-white/10 bg-brand-black py-12">
        <div className="section-shell flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
          <div className="flex items-center gap-5">
            <LogoBadge className="w-20" sizes="80px" />
            <div>
              <Wordmark className="text-2xl text-white" />
              <p className="mt-3 font-label text-xs uppercase tracking-[0.3em] text-white/45">{SITE.tagline}</p>
            </div>
          </div>

          <div className="grid gap-3 text-sm text-white/55 md:text-right">
            <div className="flex gap-5 font-label text-sm font-semibold uppercase tracking-[0.2em] md:justify-end">
              <a href={SITE.socials.instagram} target="_blank" rel="noopener noreferrer" className="transition hover:text-brand-gold">
                Instagram
              </a>
              <a href={SITE.socials.facebook} target="_blank" rel="noopener noreferrer" className="transition hover:text-brand-gold">
                Facebook
              </a>
            </div>
            <p>
              {SITE.fullName} · {SITE.address.street}, {SITE.address.cap} {SITE.address.city}
            </p>
            <p>P.IVA {SITE.piva}</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
