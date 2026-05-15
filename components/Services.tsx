"use client";

import { RevealChildren } from "@/components/animations/RevealChildren";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { services } from "@/lib/data";
import { revealInView } from "@/lib/motion-viewport";
import { motion, useReducedMotion } from "@/components/ClientMotion";
import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import { useState } from "react";
import aboutImage from "@/imgs/about.jpg";
import interiorImage from "@/imgs/interior.jpg";
import exteriorImage from "@/imgs/exterior.jpg";

type ServiceProfile = {
  punchline: string;
  bullets: [string, string];
};

type ServiceVisual = {
  src: StaticImageData;
  alt: string;
};

type ServiceTone = {
  glow: string;
  chip: string;
  ring: string;
  imageShade: string;
};

const fallbackProfile: ServiceProfile = {
  punchline: "Design-led scope with clear technical control.",
  bullets: ["Clear scope", "Execution ready"],
};

const serviceProfiles: Record<string, ServiceProfile> = {
  Interior: {
    punchline: "Premium interiors built for brand value and daily performance.",
    bullets: ["Material system", "Detail precision"],
  },
  Landscape: {
    punchline: "Landscape environments that elevate user experience and asset image.",
    bullets: ["Outdoor identity", "Water efficiency"],
  },
  Exterior: {
    punchline: "Facade and exterior identity tuned for climate and market appeal.",
    bullets: ["Facade language", "Climate response"],
  },
  "Architecture Drone": {
    punchline: "Drone-powered site data and visual reporting for fast decisions.",
    bullets: ["Aerial mapping", "Progress insight"],
  },
  "Architecture AI": {
    punchline: "AI-enhanced architecture workflows for speed, options, and precision.",
    bullets: ["Concept acceleration", "Data-backed decisions"],
  },
};

const defaultTone: ServiceTone = {
  glow: "from-[#d7bf9a]/32 to-transparent",
  chip: "border-gold/35 bg-white/[0.06] text-[#d8d0c4]",
  ring: "hover:border-gold/55",
  imageShade: "from-black/45 via-black/12 to-transparent",
};

const serviceTones: Record<string, ServiceTone> = {
  Interior: {
    glow: "from-[#d7bf9a]/32 to-transparent",
    chip: "border-gold/35 bg-white/[0.06] text-[#d8d0c4]",
    ring: "hover:border-gold/55",
    imageShade: "from-black/46 via-black/12 to-transparent",
  },
  Landscape: {
    glow: "from-[#cfb488]/28 to-transparent",
    chip: "border-gold/32 bg-white/[0.05] text-[#d4cdc2]",
    ring: "hover:border-gold/50",
    imageShade: "from-black/43 via-black/10 to-transparent",
  },
  Exterior: {
    glow: "from-[#d2bb95]/28 to-transparent",
    chip: "border-gold/34 bg-white/[0.06] text-[#dad3c8]",
    ring: "hover:border-gold/52",
    imageShade: "from-black/44 via-black/11 to-transparent",
  },
  "Architecture Drone": {
    glow: "from-[#d8c4a1]/30 to-transparent",
    chip: "border-gold/36 bg-white/[0.06] text-[#d8d0c4]",
    ring: "hover:border-gold/55",
    imageShade: "from-black/42 via-black/11 to-transparent",
  },
  "Architecture AI": {
    glow: "from-[#cfb093]/28 to-transparent",
    chip: "border-gold/33 bg-white/[0.05] text-[#d6cfc3]",
    ring: "hover:border-gold/50",
    imageShade: "from-black/43 via-black/11 to-transparent",
  },
};

function getServiceVisual(title: string): ServiceVisual {
  const normalized = title.toLowerCase();

  if (normalized.includes("interior")) {
    return {
      src: interiorImage,
      alt: "Premium interior architecture with sculpted ceiling and warm lighting",
    };
  }

  if (normalized.includes("landscape")) {
    return {
      src: aboutImage,
      alt: "Landscape-forward architecture with refined outdoor composition",
    };
  }

  if (normalized.includes("exterior")) {
    return {
      src: exteriorImage,
      alt: "Contemporary exterior architecture with strong identity",
    };
  }

  if (normalized.includes("drone")) {
    return {
      src: exteriorImage,
      alt: "Aerial architectural perspective for site intelligence",
    };
  }

  if (normalized.includes("ai")) {
    return {
      src: interiorImage,
      alt: "Digital architecture scene symbolizing AI-powered workflows",
    };
  }

  return {
    src: aboutImage,
    alt: "Modern architecture with balanced interior and exterior expression",
  };
}

export function Services() {
  const reduceMotion = useReducedMotion();
  const [activeServiceId, setActiveServiceId] = useState(services[0]?.id ?? "");

  if (!services.length) return null;

  return (
    <section
      id="services"
      className="relative isolate overflow-hidden bg-bg-primary py-20 md:py-24"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 [background-image:linear-gradient(to_right,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.04)_1px,transparent_1px)] [background-size:44px_44px,44px_44px]"
      />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -left-24 top-24 h-64 w-64 rounded-full bg-gold/14 blur-3xl"
        animate={reduceMotion ? undefined : { x: [0, 26, 0], y: [0, -14, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -right-24 bottom-16 h-64 w-64 rounded-full bg-gold/10 blur-3xl"
        animate={reduceMotion ? undefined : { x: [0, -24, 0], y: [0, 14, 0] }}
        transition={{ duration: 13, repeat: Infinity, ease: "easeInOut" }}
      />

      <RevealChildren className="relative mx-auto w-full max-w-7xl px-5 md:px-10" stagger={0.06}>
        <ScrollReveal
          dramatic
          className="max-w-3xl rounded-2xl border border-gold/15 bg-bg-card/95 p-6 shadow-[0_12px_28px_rgba(0,0,0,0.35)] md:p-7"
        >
          <p className="label-upper text-gold">Solutions</p>
          <h2 className="mt-4 font-display text-[clamp(2rem,4.8vw,3.8rem)] italic leading-[0.98] text-ink-primary">
            Creative shape.
            <span className="mt-2 block text-ink-secondary">Calm experience.</span>
          </h2>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-ink-secondary md:text-base">
            A refined board where every service has its own visual identity, without visual noise.
          </p>
        </ScrollReveal>

        <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {services.map((service) => (
            <ServiceCard
              key={service.id}
              service={service}
              reduceMotion={!!reduceMotion}
              isActive={activeServiceId === service.id}
              onActivate={() => setActiveServiceId(service.id)}
            />
          ))}
        </div>

        <ScrollReveal
          dramatic
          delay={0.08}
          className="mt-8 rounded-2xl border border-gold/24 bg-bg-card/92 p-5 backdrop-blur-[1px] md:flex md:items-center md:justify-between md:gap-4 md:px-6"
        >
          <p className="text-sm text-ink-secondary md:text-base">
            Need a custom mix? We can combine design, engineering, drone, and AI in one clean workflow.
          </p>
          <Link
            href="#contact"
            className="mt-4 inline-flex items-center justify-center rounded-full border border-gold/45 bg-gold/15 px-6 py-2.5 text-xs uppercase tracking-[0.18em] text-ink-primary transition-colors hover:bg-gold/25 md:mt-0"
            aria-label="Build custom service scope"
          >
            Build My Scope
          </Link>
        </ScrollReveal>
      </RevealChildren>
    </section>
  );
}

function ServiceCard({
  service,
  reduceMotion,
  isActive,
  onActivate,
}: {
  service: (typeof services)[number];
  reduceMotion: boolean;
  isActive: boolean;
  onActivate: () => void;
}) {
  const profile = serviceProfiles[service.title] ?? fallbackProfile;
  const visual = getServiceVisual(service.title);
  const tone = serviceTones[service.title] ?? defaultTone;

  return (
    <motion.article
      className={`group relative overflow-hidden rounded-[24px] border bg-bg-card shadow-[0_12px_28px_rgba(0,0,0,0.35)] transition-colors ${isActive ? "border-gold/45" : `border-gold/22 ${tone.ring}`}`}
      initial={{ opacity: reduceMotion ? 1 : 0, y: reduceMotion ? 0 : 48 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover={reduceMotion ? undefined : { y: -4 }}
      viewport={revealInView}
      transition={{ duration: reduceMotion ? 0 : 0.58, ease: [0.16, 1, 0.3, 1] }}
      onMouseEnter={onActivate}
      onFocusCapture={onActivate}
      // Ensure it works on touch too (not only hover).
      onPointerDown={onActivate}
      onClick={onActivate}
      tabIndex={0}
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        <Image
          src={visual.src}
          alt={visual.alt}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className={`absolute inset-0 bg-gradient-to-t ${tone.imageShade}`} />
        <div className={`absolute inset-x-0 top-0 h-16 bg-gradient-to-b ${tone.glow}`} />
        <div className="absolute left-3 top-3 inline-flex items-center gap-2">
          <span className={`label-upper rounded-full border px-2.5 py-1 ${tone.chip}`}>{service.orderLabel}</span>
          <span className="rounded-full border border-gold/30 bg-bg-primary/88 p-2 text-gold">
            <service.icon className="h-4 w-4" aria-hidden />
          </span>
        </div>
      </div>

      <div className="p-4 md:p-5">
        <RevealChildren stagger={0.045}>
          <h3 className="font-display text-[clamp(1.4rem,3.2vw,1.9rem)] italic leading-tight text-ink-primary">
            {service.title}
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-ink-secondary md:text-[0.95rem]">
            {profile.punchline}
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {profile.bullets.map((bullet) => (
              <span
                key={`${service.id}-${bullet}`}
                className="label-upper rounded-full border border-gold/26 bg-bg-primary px-3 py-1.5 text-ink-secondary"
              >
                {bullet}
              </span>
            ))}
          </div>
          <div className="mt-4">
            <Link
              href="#contact"
              className="inline-flex items-center gap-2 rounded-full border border-gold/40 px-4 py-2 text-[11px] uppercase tracking-[0.16em] text-ink-primary transition-colors hover:bg-gold/15 hover:border-gold/55"
              aria-label={`Start ${service.title} service`}
            >
              Explore Service <span aria-hidden>→</span>
            </Link>
          </div>
        </RevealChildren>
      </div>
    </motion.article>
  );
}
