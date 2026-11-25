import FeatureCards, { type FeatureCard } from "@/components/FeatureCards";
import Reveal from "@/components/Reveal";

const punti: FeatureCard[] = [
  {
    numero: "01",
    icona: "pinta",
    titolo: "Il pub, come in Irlanda",
    testo:
      "In Irlanda il pub è il centro della vita quotidiana, il luogo di ritrovo per eccellenza. Qui funziona allo stesso modo: si entra per una pinta, si resta per gli amici."
  },
  {
    numero: "02",
    icona: "carne",
    titolo: "Carne irlandese",
    testo:
      "Tra le carni più succulente sul mercato: ricca, saporita, con quel grasso dorato che la ammorbidisce in cottura. La serviamo al piatto e nei nostri panini gourmet."
  },
  {
    numero: "03",
    icona: "dolce",
    titolo: "Dolci home made",
    testo:
      "Cheesecake, panna cotta, torte calde: li prepariamo noi. Perché fare dolci è molto più che eseguire una ricetta, è un gesto d'amore."
  }
];

export default function Presentazione() {
  return (
    <section
      id="presentazione"
      className="relative scroll-mt-[var(--site-header-offset)] overflow-hidden bg-brand-cream py-24 text-brand-black md:py-32"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(254,218,20,0.28),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(252,110,2,0.08),transparent_28%)]" />

      <div className="section-shell relative">
        <div className="grid gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:items-end">
          <Reveal>
            <span className="eyebrow">chi siamo / public house</span>
            <h2 className="mt-6 text-[clamp(2.8rem,7vw,5.8rem)] leading-[0.92] text-brand-black">
              Pub,
              <br />
              Public House!
            </h2>
          </Reveal>

          <Reveal delay={0.1} className="grid gap-7">
            <p className="max-w-2xl text-[clamp(1.1rem,1.7vw,1.45rem)] leading-relaxed text-brand-black/85">
              Il pub è probabilmente l&apos;istituzione irlandese più conosciuta al mondo. Un pezzetto
              d&apos;Irlanda nel cuore di Napoli lo trovi a <strong>L&apos;Oca Nera Irish Pub</strong>: birra alla
              spina, panini gourmet, carne al piatto e una sala sotto le volte dove tutti sono benvenuti.
            </p>
            <p className="max-w-2xl text-base leading-relaxed text-brand-black/65 md:text-lg">
              Qui sotto trovi lo scaffale dei nostri panini gourmet, il menu completo dalla cucina al
              bancone e qualche foto per farti venire sete. Poi ci vediamo al Vomero.
            </p>
          </Reveal>
        </div>

        <FeatureCards cards={punti} tone="light" className="mt-16" />
      </div>
    </section>
  );
}
