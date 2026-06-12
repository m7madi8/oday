"use client";

import { CaseStudiesMenu } from "@/components/CaseStudiesMenu";
import { hero } from "@/lib/hero-content";
import { ArrowUpRight } from "lucide-react";
import { useRef, useState } from "react";

export function CaseStudiesCta() {
  const anchorRef = useRef<HTMLButtonElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div
      className="case-studies-cta-fixed case-studies-cta-fixed--ready pointer-events-auto fixed z-[490]"
    >
      <button
        ref={anchorRef}
        type="button"
        data-no-glow
        className="hero-cta-luxe hero-cta-luxe--pinned group"
        aria-label={`${hero.ctaLabel} — ${hero.ctaEyebrow}`}
        aria-expanded={menuOpen}
        aria-haspopup="dialog"
        onClick={() => setMenuOpen((open) => !open)}
      >
        <span className="flex flex-col items-start gap-0.5 pr-0.5 text-left">
          <span className="hero-cta-luxe__eyebrow font-sub uppercase text-gold/75 transition-colors group-hover:text-gold">
            {hero.ctaEyebrow}
          </span>
          <span className="hero-cta-luxe__label font-ui tracking-[0.04em] text-white/95 transition-colors group-hover:text-white">
            {hero.ctaLabel}
          </span>
        </span>
        <span className="hero-cta-luxe__icon" aria-hidden>
          <ArrowUpRight className="h-[22px] w-[22px] stroke-[1.75]" />
        </span>
      </button>

      <CaseStudiesMenu
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        anchorRef={anchorRef}
      />
    </div>
  );
}
