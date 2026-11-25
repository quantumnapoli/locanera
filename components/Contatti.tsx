import RotatingBadge from "@/components/RotatingBadge";
import Reveal from "@/components/Reveal";
import { PAGAMENTI, SERVIZI, SITE } from "@/lib/site";

export default function Contatti() {
  return (
    <section id="contatti" className="relative overflow-hidden bg-brand-gold text-brand-black">
      <div className="section-shell relative py-24 md:py-32">
        <p className="font-label text-xs font-bold uppercase tracking-[0.34em]">Contatti · dove siamo</p>

        <Reveal>
          <a
            href={SITE.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group mt-6 block font-display text-[clamp(2.6rem,8.4vw,8.5rem)] font-black leading-[0.88] tracking-[-0.02em]"
          >
            Via Gian Lorenzo
            <br />
            Bernini, 17
            <span className="ml-4 inline-block align-middle text-[0.4em] transition group-hover:translate-x-2 group-hover:-translate-y-2">
              ↗
            </span>
          </a>
          <p className="mt-4 font-label text-sm font-bold uppercase tracking-[0.3em]">
            {SITE.address.cap} {SITE.address.city} · {SITE.address.zone}
          </p>
        </Reveal>

        <div className="mt-16 grid gap-12 border-t-2 border-brand-black pt-10 md:grid-cols-3">
          <div>
            <p className="font-label text-xs font-bold uppercase tracking-[0.3em] text-brand-black/60">Chiama e prenota</p>
            <a href={SITE.phoneHref} className="mt-2 block font-display text-3xl font-black hover:underline">
              {SITE.phone}
            </a>
            <a href={`mailto:${SITE.email}`} className="mt-2 block break-all text-lg font-medium hover:underline">
              {SITE.email}
            </a>
          </div>
          <div>
            <p className="font-label text-xs font-bold uppercase tracking-[0.3em] text-brand-black/60">Orari</p>
            {SITE.orari ? (
              <ul className="mt-2 grid gap-1 text-lg">
                {SITE.orari.map((o) => (
                  <li key={o.giorno} className="flex justify-between gap-4">
                    <span>{o.giorno}</span>
                    <span className="tabular-nums">{o.ore}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-2 text-lg">Chiamaci per orari e prenotazioni.</p>
            )}
            <p className="mt-4 font-display text-xl font-black leading-tight">{SITE.parcheggio}</p>
          </div>
          <div className="flex items-start justify-between gap-6">
            <div>
              <p className="font-label text-xs font-bold uppercase tracking-[0.3em] text-brand-black/60">Seguici</p>
              <a href={SITE.socials.instagram} target="_blank" rel="noopener noreferrer" className="mt-2 block font-display text-2xl font-black hover:underline">
                Instagram ↗
              </a>
              <a href={SITE.socials.facebook} target="_blank" rel="noopener noreferrer" className="mt-1 block font-display text-2xl font-black hover:underline">
                Facebook ↗
              </a>
            </div>
            <RotatingBadge className="w-28 shrink-0 md:w-32" />
          </div>
        </div>

        <div className="mt-12 grid gap-4 border-t-2 border-brand-black pt-8 font-label text-sm font-semibold uppercase tracking-[0.18em] md:grid-cols-[auto_1fr] md:gap-x-10">
          <span className="text-brand-black/60">Servizi</span>
          <span>{SERVIZI.join(" · ")}</span>
          <span className="text-brand-black/60">Pagamenti</span>
          <span>{PAGAMENTI.join(" · ")}</span>
        </div>
      </div>

      <div className="relative h-[60vh] min-h-[22rem] border-t-2 border-brand-black">
        <iframe
          title="Mappa: L'Oca Nera Irish Pub"
          src={SITE.mapsEmbed}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="h-full w-full grayscale contrast-125"
        />
      </div>
    </section>
  );
}
