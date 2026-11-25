import Contatti from "@/components/Contatti";
import Galleria from "@/components/Galleria";
import HeroExplode from "@/components/HeroExplode";
import Manifesto from "@/components/Manifesto";
import MenuSection from "@/components/MenuSection";
import PaniniShelf from "@/components/PaniniShelf";
import Reveal from "@/components/Reveal";
import SiteHeader from "@/components/SiteHeader";
import SmoothScroll from "@/components/SmoothScroll";
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

const BANCONE = [
  { n: "11", label: "birre alla spina", text: "Guinness, Tennent's Super, Goose Island IPA, Bass, Leffe, Jupiler, Riegele e la birra del mese." },
  { n: "11", label: "whisky", text: "Jameson, Bushmills 10, Silkie Midnight, Lagavulin, Talisker e le selezioni Berry Bros & Rudd." },
  { n: "06", label: "gin da comporre", text: "Dall'An Dulaman delle alghe del Donegal a U Mauru, con quattro toniche Franklin a scelta." },
  { n: "03", label: "negroni", text: "La trilogia: bianco, del contadino, italiano. Più spritz dell'Oca, Old Fashioned, Dark 'n Stormy." }
];

export default function Home() {
  return (
    <main className="[overflow-x:clip] bg-brand-black text-white">
      <SmoothScroll />
      <SiteHeader />

      <HeroExplode />

      <section aria-hidden="true" className="overflow-hidden border-y-2 border-brand-black bg-brand-black py-5">
        <div className="flex min-w-max gap-10 whitespace-nowrap font-display text-[clamp(2rem,4vw,3.4rem)] font-black text-brand-gold animate-marquee">
          {[...tickerItems, ...tickerItems].map((item, index) => (
            <span key={`${item}-${index}`} className="flex items-center gap-10">
              {item}
              <span className="text-brand-orange">✦</span>
            </span>
          ))}
        </div>
      </section>

      <Manifesto />

      <PaniniShelf />

      <Storia />

      <MenuSection />

      {/* al bancone: lista editoriale, niente card */}
      <section className="relative overflow-hidden bg-brand-cream py-24 text-brand-black md:py-36">
        <div className="section-shell">
          <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr]">
            <Reveal>
              <p className="font-label text-xs font-bold uppercase tracking-[0.34em]">Al bancone · sláinte!</p>
              <h2 className="mt-5 font-display text-[clamp(3rem,7.4vw,7rem)] font-black leading-[0.88]">
                La vita è troppo breve per bere{" "}
                <span className="relative inline-block">
                  cattiva birra.
                  <span className="absolute inset-x-0 bottom-[0.06em] -z-10 h-[0.32em] bg-brand-gold" />
                </span>
              </h2>
            </Reveal>
            <div className="self-end">
              {BANCONE.map((b, i) => (
                <Reveal key={b.label} delay={i * 0.06}>
                  <div className="grid grid-cols-[auto_1fr] items-baseline gap-x-6 border-t-2 border-brand-black py-6">
                    <span className="font-display text-[clamp(3rem,6vw,5rem)] font-black leading-none">{b.n}</span>
                    <div>
                      <p className="font-display text-2xl font-black">{b.label}</p>
                      <p className="mt-1 text-brand-black/65">{b.text}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Galleria />

      <Contatti />

      <footer className="relative overflow-hidden bg-brand-black pb-8 pt-16 text-white">
        <div className="section-shell">
          <p
            aria-hidden="true"
            className="select-none whitespace-nowrap font-display text-[clamp(4rem,17vw,17rem)] font-black leading-[0.8] text-transparent [-webkit-text-stroke:2px_#feda14]"
          >
            L&apos;Oca Nera
          </p>
          <div className="mt-10 flex flex-col gap-3 border-t border-white/15 pt-6 font-label text-xs font-semibold uppercase tracking-[0.24em] text-white/45 md:flex-row md:justify-between">
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
