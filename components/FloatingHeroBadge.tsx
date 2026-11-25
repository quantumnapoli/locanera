"use client";

import gsap from "gsap";
import { useEffect, useRef } from "react";

import { LogoBadge } from "@/components/Logo";
import { SITE_READY_EVENT } from "@/components/SiteLoader";

/**
 * Il badge d'ingresso: fisso nel viewport e sopra ogni altro livello.
 * Fluttua da solo (animazione CSS su un layer interno) e insegue il mouse
 * con uno smorzamento (transform JS sul layer esterno), cosi i due movimenti
 * non si sovrascrivono. Quando la presentazione entra in scena smette di
 * stare fisso e scorre via verso l'alto: non sfuma sul testo, esce e basta.
 *
 * All'avvio atterra in scena con una piccola coreografia GSAP, sincronizzata
 * con SiteLoader: cade dall'alto, rimbalza in modo elastico e all'impatto
 * l'ombra si schiaccia mentre un'onda d'urto dorata si espande e svanisce.
 */
export default function FloatingHeroBadge() {
  const stageRef = useRef<HTMLDivElement | null>(null);
  const tiltRef = useRef<HTMLDivElement | null>(null);
  const landingRef = useRef<HTMLDivElement | null>(null);
  const shadowRef = useRef<HTMLDivElement | null>(null);
  const shockwaveRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const stage = stageRef.current;
    const tilt = tiltRef.current;
    const landing = landingRef.current;
    const shadow = shadowRef.current;
    const shockwave = shockwaveRef.current;
    if (!stage || !tilt || !landing || !shadow || !shockwave) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // --- atterraggio in scena --------------------------------------------
    let removeReadyListener = () => {};
    if (reduceMotion) {
      gsap.set(landing, { opacity: 1 });
    } else {
      gsap.set(landing, { opacity: 0, y: -170, rotate: -28, scale: 0.55, filter: "blur(16px)" });
      gsap.set(shockwave, { opacity: 0, scale: 0.4 });

      const playLanding = () => {
        const tl = gsap.timeline();
        tl.to(landing, {
          opacity: 1,
          y: 0,
          rotate: 0,
          scale: 1,
          filter: "blur(0px)",
          duration: 1.15,
          ease: "elastic.out(1, 0.62)"
        })
          .to(shadow, { scaleX: 1.35, scaleY: 0.62, duration: 0.16, ease: "power2.out" }, "-=0.18")
          .to(shadow, { scaleX: 1, scaleY: 1, duration: 0.6, ease: "elastic.out(1, 0.5)" })
          .to(shockwave, { opacity: 0.85, scale: 1.5, duration: 0.55, ease: "power2.out" }, "<")
          .to(shockwave, { opacity: 0, duration: 0.4 }, "-=0.2");
      };

      if (document.readyState === "complete") {
        window.setTimeout(playLanding, 120);
      } else {
        window.addEventListener(SITE_READY_EVENT, playLanding, { once: true });
        removeReadyListener = () => window.removeEventListener(SITE_READY_EVENT, playLanding);
      }
    }

    // --- movimento continuo: puntatore + rilascio allo scroll ------------
    const pointer = { x: 0, y: 0 };
    const eased = { x: 0, y: 0 };
    let frame = 0;

    const onPointerMove = (event: PointerEvent) => {
      pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
      pointer.y = (event.clientY / window.innerHeight) * 2 - 1;
    };

    let releaseAt = Number.POSITIVE_INFINITY;
    const measure = () => {
      const target = document.querySelector("#presentazione");
      if (!target) return;
      const top = target.getBoundingClientRect().top + window.scrollY;
      releaseAt = Math.max(0, top - window.innerHeight * 0.92);
    };
    measure();
    window.addEventListener("resize", measure);

    const tick = () => {
      frame = requestAnimationFrame(tick);

      eased.x += (pointer.x - eased.x) * 0.055;
      eased.y += (pointer.y - eased.y) * 0.055;

      const parked = Math.max(0, window.scrollY - releaseAt);
      const range = reduceMotion ? 0 : 1;
      const x = eased.x * 42 * range;
      const y = eased.y * 26 * range - parked;
      const rotate = eased.x * 8 * range;

      tilt.style.transform = `translate3d(${x}px, ${y}px, 0) rotate(${rotate}deg)`;
      const offScreen = parked > window.innerHeight * 1.25;
      stage.style.visibility = offScreen ? "hidden" : "visible";
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    tick();

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("resize", measure);
      removeReadyListener();
    };
  }, []);

  return (
    <div
      ref={stageRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-y-0 right-0 z-[60] hidden w-[50vw] place-items-center lg:grid"
    >
      <div ref={tiltRef} className="relative [will-change:transform]">
        <div ref={landingRef} className="relative aspect-square w-[min(34rem,62vh)] [will-change:transform,opacity,filter]">
          <div className="pointer-events-none absolute inset-[-16%] rounded-full bg-brand-gold/15 blur-[110px]" />

          <div
            ref={shockwaveRef}
            className="pointer-events-none absolute inset-[2%] rounded-full border-[3px] border-brand-gold/80 [will-change:transform,opacity]"
          />

          <div className="absolute inset-0 animate-float-badge drop-shadow-[0_50px_50px_rgba(0,0,0,0.65)] [will-change:transform]">
            <LogoBadge className="h-full w-full" priority sizes="40vw" />
          </div>

          <div
            ref={shadowRef}
            className="pointer-events-none absolute -bottom-[8%] left-1/2 h-[6%] w-[46%] origin-center animate-float-shadow rounded-[50%] bg-black blur-2xl [will-change:transform]"
          />
        </div>
      </div>
    </div>
  );
}
