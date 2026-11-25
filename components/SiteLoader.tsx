"use client";

import { useEffect, useState } from "react";

import { LogoBadge } from "@/components/Logo";

/** Il badge d'ingresso ascolta questo evento per far partire l'atterraggio
 * esattamente quando il loader si toglie di mezzo, non a caso. */
export const SITE_READY_EVENT = "locanera:site-ready";

export default function SiteLoader() {
  const [hidden, setHidden] = useState(false);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const minDelay = reduceMotion ? 0 : 850;
    const start = Date.now();
    let fallback = 0;

    const release = () => {
      const wait = Math.max(0, minDelay - (Date.now() - start));
      window.setTimeout(() => {
        setFading(true);
        window.dispatchEvent(new CustomEvent(SITE_READY_EVENT));
        window.setTimeout(() => setHidden(true), 650);
      }, wait);
    };

    if (document.readyState === "complete") {
      release();
    } else {
      window.addEventListener("load", release, { once: true });
      // rete di sicurezza: non blocchiamo mai l'ingresso per piu di 2.5s
      fallback = window.setTimeout(release, 2500);
    }

    return () => {
      window.removeEventListener("load", release);
      if (fallback) window.clearTimeout(fallback);
    };
  }, []);

  if (hidden) return null;

  return (
    <div
      aria-hidden="true"
      className={`fixed inset-0 z-[100] grid place-items-center bg-brand-black transition-opacity duration-[650ms] ease-out ${
        fading ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
    >
      <div className="flex flex-col items-center gap-7">
        <LogoBadge className="w-28 animate-pulse" priority sizes="112px" />
        <div className="h-[3px] w-36 overflow-hidden rounded-full bg-white/15">
          <div className="h-full w-1/3 animate-loader-sweep rounded-full bg-brand-gold" />
        </div>
      </div>
    </div>
  );
}
