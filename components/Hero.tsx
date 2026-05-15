"use client";

import { useGSAP } from "@/hooks/useGSAP";
import { hero } from "@/lib/data";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { useReducedMotion } from "framer-motion";
import heroImage from "@/imgs/exterior.jpg";

const frostedCta =
  "hero-enter-cta inline-flex items-center justify-center rounded-full border border-white/10 bg-[rgba(30,20,15,0.45)] px-6 py-3 text-[13px] font-normal tracking-[0.08em] text-white shadow-[0_8px_32px_rgba(0,0,0,0.18)] backdrop-blur-[12px] transition-colors hover:bg-[rgba(45,35,28,0.55)]";

const heroBezel =
  "relative flex min-h-0 flex-1 flex-col rounded-[1.15rem] bg-gradient-to-br from-white/[0.55] via-white/[0.22] to-white/[0.1] p-[2.5px] shadow-[0_28px_90px_rgba(0,0,0,0.48)] sm:rounded-[1.35rem] sm:p-[3px] md:rounded-[1.55rem]";

const heroInner =
  "relative min-h-0 w-full flex-1 overflow-hidden rounded-[1.02rem] sm:rounded-[1.2rem] md:rounded-[1.4rem]";

export function Hero() {
  const reduceMotion = useReducedMotion();
  const scopeRef = useRef<HTMLElement | null>(null);
  const mediaRef = useRef<HTMLDivElement | null>(null);
  const line1Ref = useRef<HTMLSpanElement | null>(null);
  const line2Ref = useRef<HTMLSpanElement | null>(null);
  const ctaRef = useRef<HTMLDivElement | null>(null);

  useGSAP(
    ({ gsap, addCleanup }) => {
      const media = mediaRef.current;
      const l1 = line1Ref.current;
      const l2 = line2Ref.current;
      const cta = ctaRef.current;
      if (!media || !l1 || !l2 || !cta) {
        return;
      }

      type Tl = { from: (...args: unknown[]) => Tl; kill: () => void };
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } }) as Tl;
      tl.from(media, { scale: 1.1, duration: 1.45, ease: "power2.out" }, 0)
        .from([l1, l2], { y: 80, opacity: 0, stagger: 0.16, duration: 0.95 }, 0.32)
        .from(cta, { y: 36, opacity: 0, duration: 0.62, ease: "power2.out" }, 0.62);

      addCleanup(() => {
        tl.kill();
      });
    },
    { scope: scopeRef, deps: [], once: true, enabled: !reduceMotion },
  );

  return (
    <section
      ref={scopeRef}
      id="top"
      className="relative isolate flex min-h-[100svh] w-full flex-col bg-bg-primary p-[var(--hero-gutter)]"
    >
      <div className="relative z-0 flex min-h-0 flex-1 flex-col">
        <div className={heroBezel}>
          <div className={heroInner}>
            <div className="pointer-events-none absolute inset-0 z-0">
              <div ref={mediaRef} className="relative h-full w-full brightness-[0.78]">
                <Image
                  src={heroImage}
                  alt={hero.imageAlt}
                  fill
                  priority
                  className="object-cover"
                  sizes="100vw"
                />
              </div>
            </div>

            <div
              className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-t from-black/40 via-black/10 to-black/25"
              aria-hidden
            />

            <div
              className="pointer-events-none absolute inset-x-0 top-0 z-[5] h-[min(42%,220px)] bg-gradient-to-b from-black/55 via-black/20 to-transparent"
              aria-hidden
            />

            <div className="pointer-events-none absolute inset-0 z-10">
              <h1
                className="hero-enter-headline pointer-events-auto font-outfit absolute bottom-[clamp(2.25rem,6vw,3.75rem)] left-[clamp(1.25rem,4vw,3.75rem)] max-w-[min(32rem,calc(100%-8rem))] text-[clamp(1.65rem,5.2vw,52px)] font-medium leading-[1.08] text-white [text-shadow:0_2px_48px_rgba(0,0,0,0.55)] max-sm:left-5 max-sm:max-w-[calc(100%-6.5rem)]"
              >
                <span ref={line1Ref} className="block">
                  Precision-built spaces
                </span>
                <span ref={line2Ref} className="block">
                  for serious developers.
                </span>
              </h1>

              <div
                ref={ctaRef}
                className="pointer-events-auto absolute bottom-[clamp(2.25rem,6vw,3.75rem)] right-[clamp(1.25rem,4vw,3.75rem)] max-sm:right-5"
              >
                <Link
                  href="#projects"
                  className={frostedCta}
                  aria-label="See all projects"
                >
                  See all projects
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
