"use client";

import { heroCopy } from "@/lib/hero-copy";
import { ArrowUpRight } from "lucide-react";
import dynamic from "next/dynamic";
import { useRef, useState } from "react";

const CaseStudiesMenu = dynamic(
  () => import("@/components/CaseStudiesMenu").then((m) => ({ default: m.CaseStudiesMenu })),
  { ssr: false },
);

export function CaseStudiesCta() {
  const anchorRef = useRef<HTMLButtonElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="case-studies-cta-fixed pointer-events-auto fixed z-[490]">
      <button
        ref={anchorRef}
        type="button"
        data-no-glow
        className="hero-cta-luxe hero-cta-luxe--pinned"
        aria-label={heroCopy.ctaEyebrow}
        aria-expanded={menuOpen}
        aria-haspopup="dialog"
        onClick={() => setMenuOpen((open) => !open)}
      >
        <span className="hero-cta-luxe__eyebrow font-sub uppercase text-gold/85 pr-0.5">
          {heroCopy.ctaEyebrow}
        </span>
        <span className="hero-cta-luxe__icon" aria-hidden>
          <ArrowUpRight className="h-[22px] w-[22px] stroke-[1.75]" />
        </span>
      </button>

      {menuOpen ? (
        <CaseStudiesMenu open={menuOpen} onClose={() => setMenuOpen(false)} anchorRef={anchorRef} />
      ) : null}
    </div>
  );
}
