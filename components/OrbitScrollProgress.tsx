"use client";

import brandLogo from "@/imgs/oday-logo.png";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

const RING_RADIUS = 18;
const RING_LEN = 2 * Math.PI * RING_RADIUS;

function scrollMax() {
  return Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
}

function scrollProgress() {
  return Math.min(1, Math.max(0, window.scrollY / scrollMax()));
}

export function OrbitScrollProgress() {
  const pathname = usePathname();
  const orbitRef = useRef<HTMLElement>(null);
  const idxRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<SVGCircleElement>(null);

  useEffect(() => {
    const orbit = orbitRef.current;
    const idx = idxRef.current;
    const ring = ringRef.current;
    if (!orbit || !idx || !ring) return;

    const mobile =
      window.matchMedia("(pointer: coarse)").matches ||
      window.matchMedia("(max-width: 767px)").matches;
    if (mobile) {
      orbit.hidden = true;
      return;
    }

    ring.setAttribute("stroke-dasharray", `${RING_LEN} ${RING_LEN}`);
    ring.setAttribute("stroke-dashoffset", String(RING_LEN));

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let orbitP = 0;
    let orbitNow = 0;
    let orbitRaf = 0;
    let orbitIdle = 0;

    const applyOrbit = () => {
      const pct = Math.round(orbitNow * 100);
      idx.textContent = `${pct}%`;
      orbit.setAttribute("aria-valuenow", String(pct));
      ring.setAttribute("stroke-dashoffset", String(RING_LEN * (1 - orbitNow)));
    };

    const drawOrbit = () => {
      orbitNow += (orbitP - orbitNow) * (reduceMotion ? 1 : 0.16);
      applyOrbit();
      if (Math.abs(orbitP - orbitNow) > 0.00035) {
        orbitRaf = requestAnimationFrame(drawOrbit);
      } else {
        orbitNow = orbitP;
        applyOrbit();
        orbitRaf = 0;
      }
    };

    const pulseOrbit = () => {
      orbit.classList.add("is-live");
      window.clearTimeout(orbitIdle);
      orbitIdle = window.setTimeout(() => orbit.classList.remove("is-live"), 1200);
    };

    const onOrbitScroll = () => {
      orbit.hidden = scrollMax() <= 4;
      orbitP = scrollProgress();
      pulseOrbit();
      if (!orbitRaf) orbitRaf = requestAnimationFrame(drawOrbit);
    };

    onOrbitScroll();
    window.addEventListener("scroll", onOrbitScroll, { passive: true });
    window.addEventListener("resize", onOrbitScroll);

    const resizeObserver = new ResizeObserver(onOrbitScroll);
    resizeObserver.observe(document.documentElement);

    return () => {
      window.removeEventListener("scroll", onOrbitScroll);
      window.removeEventListener("resize", onOrbitScroll);
      resizeObserver.disconnect();
      window.clearTimeout(orbitIdle);
      if (orbitRaf) cancelAnimationFrame(orbitRaf);
    };
  }, [pathname]);

  return (
    <aside
      ref={orbitRef}
      className="orbit"
      id="orbit"
      role="progressbar"
      aria-label="Page progress"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={0}
    >
      <div className="orbit-field" id="orbitField">
        <div className="orbit-seed" id="orbitSeed">
          <svg className="orbit-ring" viewBox="0 0 40 40" aria-hidden="true">
            <circle className="orbit-ring-track" cx="20" cy="20" r={RING_RADIUS} />
            <circle
              ref={ringRef}
              className="orbit-ring-value"
              id="orbitRing"
              cx="20"
              cy="20"
              r={RING_RADIUS}
            />
          </svg>
          <span className="orbit-core">
            <img
              src={brandLogo.src}
              alt=""
              width={brandLogo.width}
              height={brandLogo.height}
              className="orbit-core__logo"
            />
          </span>
        </div>
        <div className="orbit-readout" id="orbitIdx" ref={idxRef} aria-hidden="true">
          0%
        </div>
      </div>
    </aside>
  );
}
