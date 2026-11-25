"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import RotatingBadge from "@/components/RotatingBadge";
import { SITE_READY_EVENT } from "@/components/SiteLoader";
import { SITE } from "@/lib/site";

/** Fotogrammi estratti dal video Higgsfield (public/explode): 145 su desktop. */
const TOTAL_FRAMES = 145;
const framePath = (i: number) => `/explode/f${String(i).padStart(3, "0")}.webp`;
/**
 * Su mobile se ne caricano circa due terzi (97): uno ogni tre viene saltato,
 * il primo e l'ultimo restano sempre. Il movimento resta fluido, il peso scende.
 */
const frameList = (mobile: boolean) =>
  Array.from({ length: TOTAL_FRAMES }, (_, i) => i).filter(
    (i) => !mobile || i % 3 !== 2 || i === TOTAL_FRAMES - 1
  );

/** giallo del brand, lo stesso del fondo usato per generare il video */
const STAGE_BG = "#feda14";

/**
 * Etichette degli ingredienti: y è la posizione dello strato nel fotogramma
 * finale (0-1 sull'altezza), side dice da che parte del panino stanno.
 */
const LAYERS = [
  { y: 0.13, side: "left", n: "01", label: "Bun al carbone vegetale", note: "nero come l'oca" },
  { y: 0.28, side: "right", n: "02", label: "Noci", note: "croccanti, tostate" },
  { y: 0.36, side: "left", n: "03", label: "Pesto di basilico", note: "fatto in casa" },
  { y: 0.46, side: "right", n: "04", label: "Provola d'Agerola", note: "filante" },
  { y: 0.59, side: "left", n: "05", label: "Parmigiana di melanzane", note: "la domenica napoletana" },
  { y: 0.73, side: "right", n: "06", label: "Hamburger di podolico", note: "carne selezionata" },
  { y: 0.89, side: "left", n: "07", label: "Bun al carbone", note: "chiude il cerchio" }
] as const;

const clamp = (v: number, min = 0, max = 1) => Math.min(Math.max(v, min), max);
const ease = (v: number) => (v < 0.5 ? 4 * v * v * v : 1 - Math.pow(-2 * v + 2, 3) / 2);
/** progresso locale di una finestra [a, b] del progresso globale */
const range = (p: number, a: number, b: number) => clamp((p - a) / (b - a));

type DrawRect = { x: number; y: number; w: number; h: number };

export default function HeroExplode() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const tiltRef = useRef<HTMLDivElement>(null);
  const framesRef = useRef<HTMLImageElement[]>([]);
  const frameRef = useRef(0);
  const rectRef = useRef<DrawRect>({ x: 0, y: 0, w: 0, h: 0 });
  /** su mobile, 0 = panino al centro, 1 = spostato a sinistra per le etichette */
  const shiftRef = useRef(0);

  const [progress, setProgress] = useState(0);
  const [rect, setRect] = useState<DrawRect>({ x: 0, y: 0, w: 0, h: 0 });
  const [landed, setLanded] = useState(false);
  const [wide, setWide] = useState(true);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const sync = () => setWide(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  // --- pittura del fotogramma, in modalità "cover" come un video di sfondo
  const paint = (index: number) => {
    const canvas = canvasRef.current;
    const img = framesRef.current[index];
    if (!canvas || !img || !img.complete || img.naturalWidth === 0) return false;
    const ctx = canvas.getContext("2d");
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    if (!ctx || !width || !height) return false;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    if (canvas.width !== Math.round(width * dpr) || canvas.height !== Math.round(height * dpr)) {
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
    }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    // i fotogrammi sono scontornati (alpha): il titolo resta dietro al panino
    ctx.clearRect(0, 0, width, height);

    // su schermi stretti il panino esploso deve stare tutto in altezza
    // (il fotogramma è trasparente: basta scalarlo sull'altezza utile)
    const portrait = height > width * 1.1;
    const s = portrait ? ease(shiftRef.current) : 0;
    const scale = portrait
      ? (height * (0.6 - 0.1 * s)) / img.naturalHeight
      : Math.max(width / img.naturalWidth, height / img.naturalHeight) * 0.9;
    const w = img.naturalWidth * scale;
    const h = img.naturalHeight * scale;
    // il panino occupa 0.32-0.66 della larghezza del fotogramma: su mobile
    // scivola a sinistra finché il suo bordo sta a 10px, a destra le etichette
    const centered = (width - w) / 2;
    const x = centered + (10 - 0.32 * w - centered) * s;
    const y = (height - h) / 2 + (portrait ? -height * 0.05 : height * 0.03);
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(img, x, y, w, h);

    const r = rectRef.current;
    if (r.x !== x || r.y !== y || r.w !== w || r.h !== h) {
      rectRef.current = { x, y, w, h };
      setRect(rectRef.current);
    }
    return true;
  };

  // --- precaricamento: il primo fotogramma subito, gli altri in coda
  useEffect(() => {
    let cancelled = false;
    const list = frameList(window.matchMedia("(max-width: 767px)").matches);
    framesRef.current = list.map((n, i) => {
      const src = framePath(n);
      const img = new window.Image();
      img.decoding = "async";
      img.onload = () => {
        if (!cancelled && i === frameRef.current) paint(i);
      };
      img.src = src;
      return img;
    });
    return () => {
      cancelled = true;
      framesRef.current.forEach((img) => (img.onload = null));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // --- atterraggio dopo il loader
  useEffect(() => {
    const go = () => setLanded(true);
    if (document.readyState === "complete") {
      const t = window.setTimeout(go, 150);
      return () => window.clearTimeout(t);
    }
    window.addEventListener(SITE_READY_EVENT, go, { once: true });
    return () => window.removeEventListener(SITE_READY_EVENT, go);
  }, []);

  // --- scroll → fotogramma
  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const wrapper = wrapperRef.current;
      if (!wrapper) return;
      const r = wrapper.getBoundingClientRect();
      const travel = Math.max(wrapper.offsetHeight - window.innerHeight, 1);
      const p = clamp(-r.top / travel);
      // 0-0.12 hero fermo, 0.12-0.72 esplosione, poi resta aperto
      const count = Math.max(framesRef.current.length, 1);
      const f = Math.round(ease(range(p, 0.12, 0.72)) * (count - 1));
      const shift = range(p, 0.56, 0.66);
      setProgress((c) => (Math.abs(c - p) < 0.001 ? c : p));
      if (f !== frameRef.current || Math.abs(shift - shiftRef.current) > 0.002) {
        frameRef.current = f;
        shiftRef.current = shift;
        paint(f);
      }
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    const ro = new ResizeObserver(() => paint(frameRef.current));
    if (canvasRef.current) ro.observe(canvasRef.current);
    update();
    paint(0);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      ro.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // --- inclinazione 3D che segue il mouse: il "quasi 3D" del panino
  useEffect(() => {
    const el = tiltRef.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const target = { x: 0, y: 0 };
    const cur = { x: 0, y: 0 };
    let raf = 0;
    const onMove = (e: PointerEvent) => {
      target.x = (e.clientX / window.innerWidth) * 2 - 1;
      target.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    const tick = () => {
      raf = requestAnimationFrame(tick);
      cur.x += (target.x - cur.x) * 0.06;
      cur.y += (target.y - cur.y) * 0.06;
      el.style.transform = `perspective(1400px) rotateY(${cur.x * 7}deg) rotateX(${-cur.y * 5}deg) translate3d(${cur.x * 18}px, ${cur.y * 12}px, 0)`;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    tick();
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  const heroOut = range(progress, 0.02, 0.16); // testo dell'hero che esce
  const labelsIn = range(progress, 0.6, 0.74); // etichette che entrano
  const outroIn = range(progress, 0.84, 0.94); // chiusura

  return (
    <section id="top" className="relative text-brand-black" style={{ background: STAGE_BG }}>
      <div ref={wrapperRef} className="relative h-[460vh]">
        <div className="sticky top-0 h-[100svh] overflow-hidden">
          {/* titolo gigante dietro al panino */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-1/2 flex -translate-y-1/2 select-none justify-center whitespace-nowrap font-display font-black leading-[0.8] tracking-[-0.04em] text-brand-black"
            style={{
              fontSize: "clamp(5rem, 21vw, 24rem)",
              opacity: 1 - heroOut,
              transform: `translateY(-50%) scale(${1 + heroOut * 0.25})`
            }}
          >
            L&apos;Oca Nera
          </div>

          {/* il panino: canvas a tutto schermo, inclinato dal mouse */}
          <div
            ref={tiltRef}
            className="absolute inset-0 [transform-style:preserve-3d] [will-change:transform]"
          >
            <div
              className="absolute inset-0 transition-[transform,opacity,filter] duration-[1200ms] ease-[cubic-bezier(0.34,1.56,0.64,1)]"
              style={{
                opacity: landed ? 1 : 0,
                transform: landed ? "translateY(0) scale(1) rotate(0)" : "translateY(-18%) scale(0.6) rotate(-12deg)",
                filter: landed ? "blur(0)" : "blur(14px)"
              }}
            >
              <canvas
                ref={canvasRef}
                className="absolute inset-0 h-full w-full"
                aria-label="Il panino Oca Nera che si scompone nei suoi ingredienti"
                role="img"
              />
            </div>
          </div>

          {/* etichette degli ingredienti */}
          <div className="pointer-events-none absolute inset-0" style={{ opacity: labelsIn }}>
            {LAYERS.map((l, i) => {
              // su mobile noci e pesto sono vicini: li allarghiamo un poco
              const yMob = l.n === "02" ? l.y - 0.015 : l.n === "03" ? l.y + 0.015 : l.y;
              const top = rect.y + (wide ? l.y : yMob) * rect.h;
              // su mobile tutte a destra del panino, su desktop alternate
              const left = wide && l.side === "left";
              const edge = left ? rect.x + 0.31 * rect.w : rect.x + (wide ? 0.67 : 0.665) * rect.w;
              const delay = i * 0.06;
              const local = clamp((labelsIn - delay) / (1 - delay || 1));
              return (
                <div
                  key={l.n}
                  className={`absolute flex items-center gap-2 md:gap-4 ${left ? "flex-row-reverse" : ""}`}
                  style={{
                    top,
                    ...(left ? { right: `calc(100% - ${edge}px)` } : { left: edge, maxWidth: wide ? undefined : `calc(100vw - ${edge}px - 8px)` }),
                    transform: `translateY(-50%) translateX(${(1 - local) * (left ? -24 : 24)}px)`,
                    opacity: local
                  }}
                >
                  <span className="h-px w-3 shrink-0 bg-brand-black/60 md:w-16" />
                  <span className={left ? "text-right" : ""}>
                    <span className="block font-label text-[9px] font-bold uppercase tracking-[0.2em] text-brand-black/55 md:text-[11px] md:tracking-[0.3em]">
                      {l.n}
                      <span className="hidden md:inline"> · {l.note}</span>
                    </span>
                    <span className="block font-display text-[13px] font-black leading-[1.1] md:text-[clamp(1.1rem,1.6vw,1.6rem)] md:leading-tight">
                      {l.label}
                    </span>
                  </span>
                </div>
              );
            })}
          </div>

          {/* testo dell'hero: in basso, esce quando inizia l'esplosione */}
          <div
            className="section-shell absolute inset-x-0 bottom-0 z-10 flex items-end justify-between gap-8 pb-8 md:pb-10"
            style={{ opacity: 1 - heroOut, transform: `translateY(${heroOut * 40}px)` }}
          >
            <div className="max-w-md">
              <p className="font-label text-xs font-bold uppercase tracking-[0.34em]">
                Irish Pub · {SITE.address.zone}, {SITE.address.city}
              </p>
              <h1 className="mt-3 font-display text-[clamp(1.7rem,3.4vw,3rem)] font-black leading-[1.02]">
                Un pò d&apos;Irlanda nel cuore di Napoli.
              </h1>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href="#menu"
                  className="pointer-events-auto rounded-full bg-brand-black px-7 py-4 font-label text-sm font-bold uppercase tracking-[0.22em] text-brand-gold transition hover:-translate-y-0.5"
                >
                  Il menu
                </Link>
                <a
                  href={SITE.phoneHref}
                  className="pointer-events-auto rounded-full border-2 border-brand-black px-7 py-[14px] font-label text-sm font-bold uppercase tracking-[0.22em] transition hover:bg-brand-black hover:text-brand-gold"
                >
                  Prenota
                </a>
              </div>
            </div>
            <div className="hidden items-center gap-3 font-label text-xs font-bold uppercase tracking-[0.34em] md:flex">
              <span className="relative block h-12 w-7 rounded-full border-2 border-brand-black">
                <span className="absolute left-1/2 top-2 h-2.5 w-1 -translate-x-1/2 animate-bounce rounded-full bg-brand-black" />
              </span>
              Scorri per aprirlo
            </div>
          </div>

          {/* timbro rotante col badge */}
          <div
            className="absolute right-4 top-24 z-10 w-24 sm:right-8 md:top-28 md:w-36"
            style={{ opacity: 1 - heroOut }}
          >
            <RotatingBadge />
          </div>

          {/* titolo del panino durante l'esplosione */}
          <div
            className="section-shell pointer-events-none absolute inset-x-0 top-24 z-10 md:top-28"
            style={{ opacity: range(progress, 0.2, 0.3) * (1 - outroIn) * (wide ? 1 - range(progress, 0.5, 0.6) : 1 - range(progress, 0.34, 0.42)) }}
          >
            <p className="font-label text-xs font-bold uppercase tracking-[0.34em]">Il panino della casa · € 11</p>
            <h2 className="mt-2 font-display text-[clamp(2.2rem,4.2vw,4.2rem)] font-black leading-[0.92]">
              Oca Nera,
              <br />
              strato
              <br className="hidden md:block" /> per strato.
            </h2>
          </div>

          {/* chiusura */}
          <div
            className="section-shell absolute inset-x-0 bottom-0 z-10 flex flex-col items-start gap-4 pb-8 md:top-28 md:bottom-auto md:items-end md:pb-0 md:text-right"
            style={{ opacity: outroIn, transform: `translateY(${(1 - outroIn) * 30}px)`, pointerEvents: outroIn > 0.5 ? "auto" : "none" }}
          >
            <p className="max-w-[17rem] font-display text-[clamp(1.25rem,2vw,2rem)] font-black leading-[1.05] md:max-w-xs">
              Sette strati, zero scorciatoie. Si mangia solo al Vomero.
            </p>
            <Link
              href="#scaffale"
              className="rounded-full bg-brand-black px-8 py-4 font-label text-sm font-bold uppercase tracking-[0.22em] text-brand-gold transition hover:-translate-y-0.5"
            >
              Tutti i panini →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
