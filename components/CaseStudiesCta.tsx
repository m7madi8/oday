"use client";

import { CaseStudiesMenu } from "@/components/CaseStudiesMenu";
import { MagneticButton } from "@/components/animations/MagneticButton";
import { motion, useReducedMotion } from "@/components/ClientMotion";
import { hero } from "@/lib/hero-content";
import { ArrowUpRight } from "lucide-react";
import { useRef, useState } from "react";

const easeCinematic = [0.16, 1, 0.3, 1] as const;

export function CaseStudiesCta() {
  const reduceMotion = useReducedMotion();
  const anchorRef = useRef<HTMLButtonElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <motion.div
      className="case-studies-cta-fixed pointer-events-auto fixed z-[490]"
      initial={reduceMotion ? false : { opacity: 0, y: -22, filter: "blur(8px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ duration: 0.95, delay: 1.05, ease: easeCinematic }}
    >
      <MagneticButton className="inline-flex">
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
      </MagneticButton>

      <CaseStudiesMenu
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        anchorRef={anchorRef}
      />
    </motion.div>
  );
}
