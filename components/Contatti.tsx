import Reveal from "@/components/Reveal";
import { PAGAMENTI, SERVIZI, SITE } from "@/lib/site";

export default function Contatti() {
  return (
    <section id="contatti" className="relative scroll-mt-[var(--site-header-offset)] overflow-hidden bg-brand-black py-24 text-white md:py-32">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_85%_10%,rgba(254,218,20,0.12),transparent_40%)]" />
      <div className="section-shell relative">
        <Reveal>
          <span className="eyebrow-dark">contatti / dove siamo</span>
          <h2 className="mt-6 text-[clamp(2.8rem,7vw,5.6rem)] leading-[0.92]">
            Ci vediamo
            <br />
            <span className="text-brand-gold">al Vomero.</span>
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <Reveal className="grid gap-6">
            <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-7 md:p-9">
              <dl className="grid gap-7">
                <div>
                  <dt className="font-label text-[11px] font-semibold uppercase tracking-[0.3em] text-brand-gold/80">Indirizzo</dt>
                  <dd className="mt-2 font-display text-2xl font-bold leading-snug">
                    {SITE.address.street}
                    <br />
                    {SITE.address.cap} {SITE.address.city}
                  </dd>
                  <a
                    href={SITE.mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 inline-flex font-label text-sm font-semibold uppercase tracking-[0.2em] text-white/60 underline-offset-4 transition hover:text-brand-gold hover:underline"
                  >
                    Indicazioni stradali ↗
                  </a>
                </div>
                <div className="grid gap-7 sm:grid-cols-2">
                  <div>
                    <dt className="font-label text-[11px] font-semibold uppercase tracking-[0.3em] text-brand-gold/80">Telefono</dt>
                    <dd className="mt-2">
                      <a href={SITE.phoneHref} className="font-display text-xl font-bold transition hover:text-brand-gold">
                        {SITE.phone}
                      </a>
                    </dd>
                  </div>
                  <div>
                    <dt className="font-label text-[11px] font-semibold uppercase tracking-[0.3em] text-brand-gold/80">Email</dt>
                    <dd className="mt-2 break-all">
                      <a href={`mailto:${SITE.email}`} className="text-lg font-medium transition hover:text-brand-gold">
                        {SITE.email}
                      </a>
                    </dd>
                  </div>
                </div>
                <div>
                  <dt className="font-label text-[11px] font-semibold uppercase tracking-[0.3em] text-brand-gold/80">Orari</dt>
                  <dd className="mt-2 text-white/75">
                    {SITE.orari ? (
                      <ul className="grid gap-1">
                        {SITE.orari.map((o) => (
                          <li key={o.giorno} className="flex justify-between gap-4">
                            <span>{o.giorno}</span>
                            <span className="tabular-nums">{o.ore}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <>Chiamaci per orari e prenotazioni.</>
                    )}
                  </dd>
                </div>
              </dl>
            </div>

            <div className="rounded-[2rem] bg-brand-gold p-7 text-brand-black md:p-9">
              <p className="font-label text-[11px] font-bold uppercase tracking-[0.3em]">Parcheggio</p>
              <p className="mt-3 font-display text-2xl font-black leading-tight md:text-3xl">{SITE.parcheggio}</p>
            </div>
          </Reveal>

          <Reveal delay={0.1} className="min-h-[24rem] overflow-hidden rounded-[2rem] border border-white/10">
            <iframe
              title="Mappa: L'Oca Nera Irish Pub"
              src={SITE.mapsEmbed}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="h-full min-h-[24rem] w-full grayscale invert-[0.92] hue-rotate-180"
            />
          </Reveal>
        </div>

        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <Reveal className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-7 md:p-9">
            <p className="font-label text-[11px] font-semibold uppercase tracking-[0.3em] text-brand-gold/80">I nostri servizi</p>
            <ul className="mt-5 flex flex-wrap gap-2">
              {SERVIZI.map((s) => (
                <li key={s} className="rounded-full border border-white/12 px-4 py-2 text-sm text-white/80">
                  {s}
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={0.06} className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-7 md:p-9">
            <p className="font-label text-[11px] font-semibold uppercase tracking-[0.3em] text-brand-gold/80">Metodi di pagamento</p>
            <ul className="mt-5 flex flex-wrap gap-2">
              {PAGAMENTI.map((p) => (
                <li key={p} className="rounded-full border border-white/12 px-4 py-2 text-sm text-white/80">
                  {p}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
