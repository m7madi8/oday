"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { OD_FILL, OD_STROKES, OD_VIEWBOX } from "@/lib/od-logo";
import "./od-intro.css";

const KEY = "od-intro-seen";
const MAX_WAIT = 3200;

/** Resolves when the page is loaded + fonts ready, or after MAX_WAIT. */
const pageReady = () =>
  Promise.race([
    Promise.all([
      document.readyState === "complete"
        ? Promise.resolve()
        : new Promise((r) => window.addEventListener("load", r, { once: true })),
      document.fonts?.ready ?? Promise.resolve(),
    ]),
    new Promise((r) => setTimeout(r, MAX_WAIT)),
  ]);

/** FLIP hand-off: lift → arc-like flight → merge with header logo. */
function flyToHeader(
  el: HTMLElement,
  markEl: HTMLElement,
  svg: SVGElement,
  onDone: () => void,
  duration: number,
) {
  const target = document.querySelector<HTMLElement>("[data-od-nav-logo]");
  const h = gsap.timeline({ onComplete: onDone });

  const endFlight = () => {
    el.classList.remove("is-handoff");
  };

  if (!target) {
    h.to(svg, { opacity: 0, duration: 0.4 }).to(
      el,
      { opacity: 0, backgroundColor: "rgba(255,255,255,0)", duration: 0.45, ease: "power1.inOut" },
      0.05,
    );
    h.eventCallback("onComplete", () => {
      endFlight();
      onDone();
    });
    return h;
  }

  const b = target.getBoundingClientRect();
  if (b.width <= 0 || b.height <= 0) {
    h.to(svg, { opacity: 0, duration: 0.4 }).to(
      el,
      { opacity: 0, backgroundColor: "rgba(255,255,255,0)", duration: 0.45, ease: "power1.inOut" },
      0.05,
    );
    h.eventCallback("onComplete", () => {
      endFlight();
      onDone();
    });
    return h;
  }

  el.classList.add("is-handoff");

  const a = svg.getBoundingClientRect();
  const scale = b.width / a.width;
  const dx = b.left - a.left;
  const dy = b.top - a.top;
  const lift = 0.2;
  const flightStart = lift * 0.55;
  const landAt = flightStart + duration;

  gsap.set(svg, {
    filter: "drop-shadow(0 20px 50px rgba(29, 29, 27, 0.2))",
  });

  h.to(markEl, { scale: 1.045, duration: lift, ease: "power2.out" }, 0)
    .to(
      markEl,
      { scale: 1, duration: duration * 0.35, ease: "power2.inOut" },
      flightStart + duration * 0.25,
    )
    .to(
      svg,
      {
        x: dx,
        y: dy,
        scale,
        duration,
        ease: "power3.inOut",
      },
      flightStart,
    )
    .to(
      svg,
      {
        y: dy - Math.min(28, a.height * 0.04),
        duration: duration * 0.42,
        ease: "power2.out",
      },
      flightStart,
    )
    .to(
      svg,
      {
        y: dy,
        duration: duration * 0.58,
        ease: "power2.in",
      },
      flightStart + duration * 0.42,
    )
    .to(
      svg,
      {
        filter: "drop-shadow(0 6px 18px rgba(29, 29, 27, 0.12))",
        duration: duration * 0.45,
        ease: "power1.out",
      },
      flightStart + duration * 0.35,
    )
    .to(
      el,
      { backgroundColor: "rgba(255,255,255,0)", duration: 0.55, ease: "power1.inOut" },
      flightStart + 0.08,
    )
    .to(svg, { opacity: 0, duration: 0.14, ease: "power2.in" }, landAt - 0.06)
    .to(el, { opacity: 0, duration: 0.28, ease: "power2.in" }, landAt - 0.02)
    .add(endFlight, landAt);

  return h;
}

export default function OdIntro() {
  const root = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const el = root.current!;
    const q = gsap.utils.selector(el);
    const html = document.documentElement;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const mobile = matchMedia("(max-width: 640px)").matches;
    let seen = false;
    try {
      seen = !!sessionStorage.getItem(KEY);
    } catch {}

    html.dataset.intro = "playing";
    html.style.overflow = "hidden";

    const announce = () => {
      html.dataset.intro = "done";
      window.dispatchEvent(new Event("od:intro-done"));
    };

    const finish = () => {
      html.style.overflow = "";
      const draft = el.querySelector<SVGElement>(".od-draft");
      const mark = el.querySelector<HTMLElement>(".od-mark");
      if (draft) gsap.set(draft, { clearProps: "transform,opacity,filter" });
      if (mark) gsap.set(mark, { clearProps: "transform" });
      el.classList.remove("is-handoff");
      try {
        sessionStorage.setItem(KEY, "1");
      } catch {}
      el.style.display = "none";
    };

    const ctx = gsap.context(() => {
      gsap.set(q(".od-gv1"), { x: -16 });
      gsap.set(q(".od-gv2"), { x: 16 });
      gsap.set(q(".od-line"), { strokeDasharray: 1, strokeDashoffset: 1 });
      gsap.set(q(".od-reg, .od-meas-ticks"), { opacity: 0 });

      if (reduce || seen) {
        gsap.set(q(".od-fill"), { opacity: 1 });
        gsap.set(q(".od-g, .od-ct"), { opacity: 0 });
        const t = reduce ? 0.9 : 0.6;
        gsap
          .timeline({ onComplete: finish })
          .fromTo(
            q(".od-mark"),
            { opacity: 0, scale: 0.96 },
            { opacity: 1, scale: 1, duration: reduce ? 0.5 : 0.4, ease: "power2.out" },
          )
          .to(el, { opacity: 0, duration: 0.45, ease: "power1.inOut" }, t)
          .add(announce, t);
        return;
      }

      const paths = q(".od-ct path");
      const tl = gsap.timeline();
      tl.timeScale(mobile ? 1.3 : 1);

      tl.to(q(".od-gh"), { strokeDashoffset: 0, duration: 0.7, ease: "expo.out" }, 0.05)
        .to(q(".od-gv"), { strokeDashoffset: 0, duration: 0.8, ease: "expo.out", stagger: 0.08 }, 0.1)
        .to(q(".od-gb"), { strokeDashoffset: 0, duration: 0.8, ease: "expo.out" }, 0.2)
        .to(q(".od-reg"), { opacity: 0.28, duration: 0.3 }, 0.25)
        .to(paths, { strokeDashoffset: 0, duration: 0.95, ease: "power3.inOut", stagger: { amount: 0.55 } }, 0.35)
        .to(q(".od-gv1, .od-gv2"), { x: 0, duration: 0.5, ease: "expo.out" }, 1.05)
        .to(q(".od-meas-line"), { strokeDashoffset: 0, duration: 0.5, ease: "expo.out" }, 1.1)
        .to(q(".od-meas-ticks"), { opacity: 0.28, duration: 0.2 }, 1.2)
        .fromTo(q(".od-dot"), { opacity: 1, scale: 3 }, { scale: 1, duration: 0.3, ease: "expo.inOut" }, 1.3)
        .to(q(".od-dot"), { opacity: 0, duration: 0.2 }, 1.62)
        .to(q(".od-fill"), { opacity: 1, duration: 0.42, ease: "power2.out" }, 1.5)
        .to(paths, { opacity: 0, duration: 0.3 }, 1.8)
        .to(q(".od-g"), { opacity: 0, duration: 0.45, ease: "power2.inOut" }, 1.7);

      const tlDone = new Promise<void>((resolve) => {
        tl.eventCallback("onComplete", () => resolve());
      });

      Promise.all([pageReady(), tlDone]).then(() => {
        const markEl = q(".od-mark")[0] as HTMLElement;
        const svg = q(".od-draft")[0] as unknown as SVGElement;
        const duration = mobile ? 0.72 : 0.95;
        const flight = flyToHeader(el, markEl, svg, finish, duration);
        const announceAt = 0.2 + duration * 0.78;
        flight.add(announce, announceAt);
      });
    }, el);

    return () => {
      ctx.revert();
      html.style.overflow = "";
      delete html.dataset.intro;
    };
  }, []);

  return (
    <div ref={root} className="od-intro" aria-hidden="true">
      <div className="od-mark">
        <svg className="od-draft" viewBox={OD_VIEWBOX}>
          <g transform="translate(208 470)">
            <g className="od-g">
              <line className="od-line od-gh" x1="-3000" y1="226" x2="3800" y2="226" pathLength={1} />
              <line className="od-line od-gv od-gv1" x1="232" y1="-3000" x2="232" y2="3600" pathLength={1} />
              <line className="od-line od-gv od-gv2" x1="442" y1="-3000" x2="442" y2="3600" pathLength={1} />
              <line className="od-line od-gb od-opt" x1="-3000" y1="442" x2="3800" y2="442" pathLength={1} />
            </g>
            <g className="od-g od-reg od-opt">
              <path d="M-14 -14H-34M-14 -14V-34M816 -14H836M816 -14V-34M-14 609H-34M-14 609V629M816 609H836M816 609V629" />
            </g>
            <g className="od-g od-opt">
              <line className="od-line od-meas-line" x1="0" y1="660" x2="802" y2="660" pathLength={1} />
              <path className="od-meas-ticks" d="M0 650V670M802 650V670M401 655V665M200 656V664M601 656V664" />
            </g>
          </g>
          <g className="od-ct">{OD_STROKES.map((d, i) => <path key={i} d={d} pathLength={1} />)}</g>
          <path className="od-fill" d={OD_FILL} />
          <circle className="od-dot" cx="440" cy="696" r="4" />
        </svg>
      </div>
    </div>
  );
}
