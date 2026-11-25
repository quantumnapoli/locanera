"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { LogoBadge, Wordmark } from "@/components/Logo";
import { SITE } from "@/lib/site";

const links = [
  { href: "#presentazione", label: "Il pub" },
  { href: "#scaffale", label: "Panini" },
  { href: "#menu", label: "Menu" },
  { href: "#galleria", label: "Galleria" },
  { href: "#contatti", label: "Contatti" }
];

/**
 * La barra sparisce quando si scende e torna appena si risale, cosi lo
 * scaffale a tutto schermo resta libero. Sopra la piega resta sempre visibile.
 */
export default function SiteHeader() {
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  const lastY = useRef(0);

  useEffect(() => {
    lastY.current = window.scrollY;
    let frame = 0;

    const update = () => {
      frame = 0;
      const y = window.scrollY;
      const delta = y - lastY.current;

      // soglia piccola: evita che micro-scatti facciano sfarfallare la barra
      if (Math.abs(delta) > 6) {
        setHidden(delta > 0 && y > 120);
        if (delta > 0) setOpen(false);
        lastY.current = y;
      }
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-[70] isolate transition-transform duration-500 ease-[cubic-bezier(0.2,0.72,0.24,1)] ${
        hidden ? "-translate-y-[130%]" : "translate-y-0"
      }`}
    >
      <div className="section-shell pb-1 pt-[calc(1rem+env(safe-area-inset-top,0px))]">
        <div className="rounded-[1.75rem] border border-brand-gold/20 bg-brand-black/80 px-3 py-2 shadow-[0_18px_50px_rgba(0,0,0,0.45)] backdrop-blur-xl md:px-4">
          <div className="flex items-center justify-between gap-3">
            <Link href="#" className="flex items-center gap-3 text-white" aria-label="L'Oca Nera, torna in cima">
              <LogoBadge className="w-11" priority sizes="44px" />
              <Wordmark className="hidden text-lg sm:flex" />
            </Link>

            <nav className="hidden items-center gap-6 font-label text-[13px] font-semibold uppercase tracking-[0.24em] text-white/70 lg:flex">
              {links.map((link) => (
                <Link key={link.href} href={link.href} className="transition hover:text-brand-gold">
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-2">
              <a
                href={SITE.phoneHref}
                className="inline-flex items-center gap-2 rounded-full bg-brand-gold px-4 py-2 font-label text-[12px] font-bold uppercase tracking-[0.2em] text-brand-black transition hover:-translate-y-0.5 hover:bg-white"
              >
                Prenota
                <span aria-hidden="true">→</span>
              </a>
              <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                aria-expanded={open}
                aria-label={open ? "Chiudi il menu di navigazione" : "Apri il menu di navigazione"}
                className="grid h-10 w-10 place-items-center rounded-full border border-white/15 text-white lg:hidden"
              >
                <span aria-hidden="true" className="text-lg leading-none">
                  {open ? "✕" : "☰"}
                </span>
              </button>
            </div>
          </div>

          {open && (
            <nav className="grid gap-1 border-t border-white/10 px-2 pb-2 pt-3 font-label text-sm font-semibold uppercase tracking-[0.22em] text-white/80 lg:hidden">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="rounded-xl px-3 py-3 transition hover:bg-white/5 hover:text-brand-gold"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          )}
        </div>
      </div>
    </header>
  );
}
