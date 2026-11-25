"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const TESTO =
  "Non un semplice pub, ma una Public House. Un posto dove tutti sono benvenuti, dove non troverai sconosciuti ma solo buoni amici che non hai ancora avuto il piacere d'incontrare.";

// parole da evidenziare in oro
const ORO = new Set(["Public", "House.", "benvenuti,", "amici"]);

// foto sparse come post appoggiati sul bancone: posizione, rotazione, velocità di parallasse
const FOTO = [
  { src: "/foto/spina.webp", alt: "Spillatura al bancone", cls: "left-[1%] top-[5%] w-[28vw] md:w-[14vw]", r: -8, s: 0.25 },
  { src: "/foto/guinness.webp", alt: "La spina Guinness", cls: "right-[2%] top-[3%] w-[26vw] md:w-[12vw]", r: 7, s: 0.45 },
  { src: "/foto/amici.webp", alt: "Amici a tavola", cls: "left-[1%] bottom-[2%] w-[30vw] md:w-[14vw]", r: 5, s: 0.55 },
  { src: "/foto/cartello.webp", alt: "La vita è troppo breve per bere cattiva birra", cls: "right-[1%] bottom-[3%] w-[28vw] md:w-[13vw]", r: -6, s: 0.3 }
];

export default function Manifesto() {
  const ref = useRef<HTMLDivElement>(null);
  const [p, setP] = useState(0);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const travel = el.offsetHeight - window.innerHeight;
      setP(Math.min(Math.max(-r.top / Math.max(travel, 1), 0), 1));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  const words = TESTO.split(" ");

  return (
    <section id="presentazione" className="relative bg-brand-black text-white">
      <div ref={ref} className="relative h-[260vh]">
        <div className="sticky top-0 flex h-[100svh] items-center overflow-hidden">
          {FOTO.map((f) => (
            <div
              key={f.src}
              className={`absolute ${f.cls} aspect-square overflow-hidden rounded-md shadow-[0_30px_60px_rgba(0,0,0,0.6)]`}
              style={{
                transform: `translateY(${(0.5 - p) * f.s * 600}px) rotate(${f.r + (p - 0.5) * f.r * 0.6}deg)`,
                opacity: 0.35 + Math.min(p * 2, 1) * 0.65
              }}
            >
              <Image src={f.src} alt={f.alt} fill sizes="(min-width: 768px) 18vw, 34vw" className="object-cover" />
            </div>
          ))}

          <div className="section-shell relative z-10">
            <p className="font-label text-xs font-bold uppercase tracking-[0.34em] text-brand-gold">Pub, Public House!</p>
            <p className="mt-6 max-w-[22ch] font-display text-[clamp(2.2rem,5.6vw,5.4rem)] font-black leading-[1.02] md:mx-auto md:text-center">
              {words.map((w, i) => {
                const lit = p * 1.25 * words.length > i;
                return (
                  <span
                    key={i}
                    className="transition-colors duration-300"
                    style={{ color: lit ? (ORO.has(w) ? "#feda14" : "#ffffff") : "rgba(255,255,255,0.14)" }}
                  >
                    {w}{" "}
                  </span>
                );
              })}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
