"use client";

import { useGSAP } from "@/hooks/useGSAP";
import { hero } from "@/lib/data";
import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { useReducedMotion } from "@/components/ClientMotion";
import heroImage from "@/imgs/exterior.jpg";

export function Hero() {
  const reduceMotion = useReducedMotion();
  const scopeRef = useRef<HTMLElement | null>(null);
  const mediaRef = useRef<HTMLDivElement | null>(null);
  const eyebrowRef = useRef<HTMLParagraphElement | null>(null);
  const leadRef = useRef<HTMLSpanElement | null>(null);
  const accentLeadRef = useRef<HTMLSpanElement | null>(null);
  const accentEmphasisRef = useRef<HTMLSpanElement | null>(null);
  const sublineRef = useRef<HTMLParagraphElement | null>(null);
  const ruleRef = useRef<HTMLSpanElement | null>(null);
  const ctaRef = useRef<HTMLDivElement | null>(null);

  useGSAP(
    ({ gsap, addCleanup }) => {
      const media = mediaRef.current;
      const eyebrow = eyebrowRef.current;
      const lead = leadRef.current;
      const accentLead = accentLeadRef.current;
      const accentEmphasis = accentEmphasisRef.current;
      const subline = sublineRef.current;
      const rule = ruleRef.current;
      const cta = ctaRef.current;
      if (!media || !eyebrow || !lead || !accentLead || !accentEmphasis || !subline || !rule || !cta) {
        return;
      }

      type Tl = { from: (...args: unknown[]) => Tl; kill: () => void };
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } }) as Tl;
      tl.from(media, { scale: 1.1, duration: 1.45, ease: "power2.out" }, 0)
        .from(cta, { y: -28, opacity: 0, duration: 0.72, ease: "power2.out" }, 0.18)
        .from(rule, { scaleX: 0, opacity: 0, transformOrigin: "left center", duration: 0.7, ease: "power2.inOut" }, 0.3)
        .from(
          [eyebrow, lead, accentLead, accentEmphasis, subline],
          { y: 56, opacity: 0, stagger: 0.09, duration: 0.92 },
          0.26,
        )
        .from(
          accentEmphasis,
          { scale: 0.96, duration: 1.05, ease: "power4.out" },
          0.42,
        );

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
      className="relative flex min-h-[100svh] w-full flex-col bg-bg-primary px-[var(--hero-gutter)] pt-[var(--hero-gutter)] pb-0"
    >
      <div className="relative z-0 flex min-h-0 flex-1 flex-col overflow-hidden">
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
          className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-t from-[#121212] via-black/20 to-black/30"
          aria-hidden
        />

        <div
          className="pointer-events-none absolute inset-x-0 top-0 z-[5] h-[min(48%,260px)] bg-gradient-to-b from-black/62 via-black/28 to-transparent"
          aria-hidden
        />

        <div className="relative z-10 flex min-h-0 flex-1 flex-col">
          <div
            ref={ctaRef}
            className="hero-enter-cta pointer-events-auto absolute right-[clamp(1.25rem,4vw,3.75rem)] top-[var(--hero-cta-top)] z-20 max-sm:right-5"
          >
            <Link
              href="/projects"
              data-no-glow
              className="hero-cta-luxe group"
              aria-label={`${hero.ctaLabel} — ${hero.ctaEyebrow}`}
            >
              <span className="flex flex-col items-start gap-0.5 pr-0.5 text-left">
                <span className="hero-cta-luxe__eyebrow font-outfit font-medium uppercase text-gold/75 transition-colors group-hover:text-gold">
                  {hero.ctaEyebrow}
                </span>
                <span className="hero-cta-luxe__label font-outfit font-medium tracking-[0.04em] text-white/95 transition-colors group-hover:text-white">
                  {hero.ctaLabel}
                </span>
              </span>
              <span className="hero-cta-luxe__icon" aria-hidden>
                <ArrowUpRight className="h-[18px] w-[18px] stroke-[1.75]" />
              </span>
            </Link>
          </div>

          <div className="hero-enter-headline pointer-events-auto absolute bottom-[clamp(2rem,5.5vw,3.75rem)] left-[clamp(1.25rem,4vw,3.75rem)] max-w-[min(42rem,calc(100%-2.5rem))] max-sm:left-5 max-sm:max-w-[calc(100%-2.5rem)]">
            <p
              ref={eyebrowRef}
              className="font-outfit text-[10px] font-medium uppercase tracking-[0.34em] text-white/62 md:text-[11px]"
            >
              {hero.headlineEyebrow}
            </p>

            <span
              ref={ruleRef}
              className="mt-4 block h-px w-[min(4.5rem,28vw)] origin-left bg-gradient-to-r from-gold/80 via-gold/35 to-transparent"
              aria-hidden
            />

            <h1 className="mt-4">
              <span
                ref={leadRef}
                className="block font-outfit text-[10px] font-semibold uppercase tracking-[0.32em] text-white/65 md:text-[11px]"
              >
                {hero.headlineLead}
              </span>
              <span className="hero-accent mt-1 block" aria-label={`${hero.headlineAccentLead} ${hero.headlineAccentEmphasis}`}>
                <span ref={accentLeadRef} className="hero-accent-lead block">
                  {hero.headlineAccentLead}
                </span>
                <span ref={accentEmphasisRef} className="hero-accent-emphasis block">
                  {hero.headlineAccentEmphasis}
                </span>
              </span>
            </h1>

            <p
              ref={sublineRef}
              className="mt-5 max-w-[34ch] font-body text-[13px] font-light leading-relaxed text-white/72 md:max-w-[38ch] md:text-sm"
            >
              {hero.headlineSubline}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
