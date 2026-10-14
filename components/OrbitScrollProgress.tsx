"use client";

import brandLogo from "@/imgs/oday-logo.png";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

const RING_RADIUS = 18;
const RING_LEN = 2 * Math.PI * RING_RADIUS;

function isHomePath(pathname: string) {
  return pathname === "/" || pathname === "";
}

function elementDocumentTop(el: HTMLElement): number {
  return el.getBoundingClientRect().top + window.scrollY;
}

type OrbitScrollMetrics = {
  scrollMax: number;
  footerDocTop: number | null;
  pageScrollable: boolean;
};

function measureOrbitScrollMetrics(pathname: string): OrbitScrollMetrics {
  const pageScrollable =
    document.documentElement.scrollHeight > window.innerHeight + 8;

  if (isHomePath(pathname)) {
    const footer = document.getElementById("footer");
    const contact = document.getElementById("contact");
    const endTop = footer
      ? elementDocumentTop(footer)
      : contact
        ? elementDocumentTop(contact) + contact.offsetHeight
        : null;
    if (endTop != null) {
      return {
        scrollMax: Math.max(1, endTop - window.innerHeight),
        footerDocTop: footer ? elementDocumentTop(footer) : null,
        pageScrollable,
      };
    }
  }

  return {
    scrollMax: Math.max(1, document.documentElement.scrollHeight - window.innerHeight),
    footerDocTop: null,
    pageScrollable,
  };
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
    let scrollSyncRaf = 0;
    let layoutSyncTimer = 0;
    let metrics = measureOrbitScrollMetrics(pathname);

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

    const syncOrbitFromScroll = () => {
      scrollSyncRaf = 0;
      const inFooter =
        metrics.footerDocTop != null &&
        window.scrollY + window.innerHeight > metrics.footerDocTop + 32;

      orbit.hidden = !metrics.pageScrollable;
      orbit.classList.toggle("orbit--in-footer", inFooter);
      if (inFooter) {
        orbit.setAttribute("aria-hidden", "true");
        if (orbitRaf) {
          cancelAnimationFrame(orbitRaf);
          orbitRaf = 0;
        }
        return;
      }
      orbit.setAttribute("aria-hidden", "false");
      orbitP = Math.min(1, Math.max(0, window.scrollY / metrics.scrollMax));
      pulseOrbit();
      if (!orbitRaf) orbitRaf = requestAnimationFrame(drawOrbit);
    };

    const scheduleOrbitScroll = () => {
      if (scrollSyncRaf) return;
      scrollSyncRaf = requestAnimationFrame(syncOrbitFromScroll);
    };

    const remeasureAndSync = () => {
      metrics = measureOrbitScrollMetrics(pathname);
      scheduleOrbitScroll();
    };

    const scheduleLayoutSync = () => {
      window.clearTimeout(layoutSyncTimer);
      layoutSyncTimer = window.setTimeout(remeasureAndSync, 180);
    };

    remeasureAndSync();
    window.addEventListener("scroll", scheduleOrbitScroll, { passive: true });
    window.addEventListener("resize", scheduleLayoutSync);

    const resizeObserver = new ResizeObserver(scheduleLayoutSync);
    resizeObserver.observe(document.documentElement);

    return () => {
      window.removeEventListener("scroll", scheduleOrbitScroll);
      window.removeEventListener("resize", scheduleLayoutSync);
      resizeObserver.disconnect();
      window.clearTimeout(orbitIdle);
      window.clearTimeout(layoutSyncTimer);
      if (orbitRaf) cancelAnimationFrame(orbitRaf);
      if (scrollSyncRaf) cancelAnimationFrame(scrollSyncRaf);
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
