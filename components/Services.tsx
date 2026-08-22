"use client";

import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { ServicePanelMedia } from "@/components/ServicePanelMedia";
import { SectionHeader, SectionInner, SectionShell } from "@/components/SectionShell";
import { services } from "@/lib/content/services";
import { serviceVisualBySlug } from "@/lib/content/service-visuals";
import Link from "next/link";
import { SafeButton } from "@/components/SafeButton";
import { ArrowUpRight } from "lucide-react";
import { useCallback, useRef, useState } from "react";
import { useReducedMotion } from "@/components/ClientMotion";

type ServiceProfile = {
  tagline: string;
  punchline: string;
  verticalLabel: string;
};

const IMAGE_SIZES_DESKTOP = "(max-width: 1280px) 28vw, (max-width: 1536px) 24vw, 22vw";
const IMAGE_SIZES_STORY = "(max-width: 768px) 85vw, 320px";

const fallbackProfile: ServiceProfile = {
  tagline: "Oday scope",
  punchline: "Design-led scope with clear technical control from concept to delivery.",
  verticalLabel: "Architecture",
};

const serviceProfiles: Record<string, ServiceProfile> = {
  "Interior Design": {
    tagline: "Interior systems",
    punchline:
      "Premium interiors built for brand value, material clarity, and execution-ready detailing.",
    verticalLabel: "Interior Design",
  },
  "Exterior Design": {
    tagline: "Facade & landscape",
    punchline:
      "Facades, villas, residential buildings, and integrated landscape — tuned for climate, massing, and market appeal.",
    verticalLabel: "Exterior Design",
  },
  "Architect Dron": {
    tagline: "Aerial intelligence",
    punchline:
      "Drone-powered site data and visual reporting for faster, sharper project decisions.",
    verticalLabel: "Architect Dron",
  },
  "Ai architect": {
    tagline: "AI workflows",
    punchline:
      "AI-enhanced architecture workflows for speed, option exploration, and precision.",
    verticalLabel: "Ai architect",
  },
};

function getServiceVisual(slug: (typeof services)[number]["slug"]) {
  return serviceVisualBySlug[slug];
}

const stripBezel =
  "rounded-[1.1rem] bg-gradient-to-br from-gold/55 via-white/25 to-gold/20 p-[2px] shadow-[0_40px_100px_rgba(0,0,0,0.65),0_0_0_1px_rgba(245, 197, 24,0.12)] lg:rounded-[1.25rem] lg:p-[3px]";

const stripInner =
  "flex h-full min-h-[inherit] w-full overflow-hidden rounded-[1.02rem] bg-transparent lg:rounded-[1.15rem]";

export function Services() {
  const [activeId, setActiveId] = useState(services[0]?.id ?? "");

  if (!services.length) return null;

  return (
    <SectionShell id="services" snap={false} containOverflow={false} className="services-section">
      <SectionInner className="services-section__head">
        <ScrollReveal dramatic>
          <div className="section-editorial-head">
            <span className="section-editorial-head__index" aria-hidden>
              02
            </span>
            <SectionHeader
              eyebrow="Solutions"
              title={
                <>
                  Four disciplines.
                  <span className="mt-1 block bg-gradient-to-r from-gold via-[#fff3b0] to-gold/70 bg-clip-text text-transparent">
                    One cinematic frame.
                  </span>
                </>
              }
              description="Architecture, interiors, drone intelligence, and AI workflows — integrated under OD Architects."
            />
          </div>
        </ScrollReveal>
      </SectionInner>

      {/* Mobile / tablet carousel */}
      <ServicesMobileCarousel />

      {/* Desktop — full-width stage */}
      <ScrollReveal dramatic delay={0.06} className="services-stage mt-3 hidden lg:block">
        <div className={`${stripBezel} services-stage__frame`}>
          <div
            className="services-panel-scroll"
            onMouseLeave={() => setActiveId(services[0]?.id ?? "")}
          >
            <div className={`${stripInner} services-panel-track`}>
              {services.map((service, index) => (
                <ServicePanel
                  key={service.id}
                  service={service}
                  index={index}
                  isActive={activeId === service.id}
                  onActivate={() => setActiveId(service.id)}
                />
              ))}
            </div>
          </div>
        </div>
      </ScrollReveal>
    </SectionShell>
  );
}

const SWIPE_THRESHOLD_PX = 48;

function ServicesMobileCarousel() {
  const reduceMotion = useReducedMotion();
  const [activeIndex, setActiveIndex] = useState(0);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);

  const goTo = useCallback((index: number) => {
    setActiveIndex(Math.max(0, Math.min(services.length - 1, index)));
  }, []);

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    if (e.touches.length !== 1) {
      touchStartRef.current = null;
      return;
    }
    const t = e.touches[0];
    touchStartRef.current = { x: t.clientX, y: t.clientY };
  }, []);

  const onTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      const start = touchStartRef.current;
      touchStartRef.current = null;
      if (!start || e.changedTouches.length !== 1) return;

      const t = e.changedTouches[0];
      const dx = t.clientX - start.x;
      const dy = t.clientY - start.y;

      if (Math.abs(dx) < SWIPE_THRESHOLD_PX || Math.abs(dx) <= Math.abs(dy)) return;

      if (dx < 0) goTo(activeIndex + 1);
      else goTo(activeIndex - 1);
    },
    [activeIndex, goTo],
  );

  return (
    <div className="services-carousel mt-6 lg:hidden">
      <div
        className="services-carousel__viewport"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        aria-roledescription="carousel"
        aria-label="Services"
      >
        <div
          className="services-carousel__track"
          style={{
            transform: `translate3d(-${activeIndex * 100}%, 0, 0)`,
            transition: reduceMotion ? "none" : undefined,
          }}
        >
          {services.map((service, index) => (
            <div
              key={service.id}
              className="services-carousel__slide"
              aria-hidden={activeIndex !== index}
            >
              <ServiceStoryCard
                service={service}
                isActive={activeIndex === index}
                activeIndex={activeIndex}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="services-dots mt-3 flex items-center justify-center" role="tablist" aria-label="Service slides">
        {services.map((service, index) => (
          <SafeButton
            key={service.id}
            data-no-glow
            role="tab"
            aria-selected={activeIndex === index}
            aria-label={`Go to ${service.title}`}
            onClick={() => goTo(index)}
            className="services-dots__btn"
          >
            <span
              className={`block h-1.5 rounded-full transition-all duration-300 ${
                activeIndex === index ? "w-7 bg-gold" : "w-1.5 bg-gold/35"
              }`}
            />
          </SafeButton>
        ))}
      </div>
    </div>
  );
}

/** Mobile story card — used inside transform carousel (not scroll container) */
function ServiceStoryCard({
  service,
  isActive,
  activeIndex,
}: {
  service: (typeof services)[number];
  isActive: boolean;
  activeIndex: number;
}) {
  const profile = serviceProfiles[service.title] ?? fallbackProfile;
  const visual = getServiceVisual(service.slug);
  const Icon = service.icon;

  return (
    <article
      className={`services-story-card relative aspect-[9/16] h-[min(62svh,560px)] w-full max-w-[min(100%,20rem)] shrink-0 bg-transparent${
        isActive ? " services-story-card--active" : ""
      }`}
    >
      <div className="relative h-full w-full overflow-hidden rounded-[1.12rem] shadow-[0_16px_40px_rgba(0,0,0,0.35)] ring-1 ring-white/[0.08]">
        <div className="absolute inset-0">
          <ServicePanelMedia
            visual={visual}
            isPlaying={isActive}
            sizes={IMAGE_SIZES_STORY}
            imageClassName="services-panel-image object-cover brightness-[1.03] contrast-[1.02] saturate-[1.06]"
          />
        </div>

        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.06) 34%, rgba(0,0,0,0.12) 58%, rgba(0,0,0,0.82) 100%)",
          }}
        />

        <div className="absolute inset-x-0 top-0 z-20 flex gap-1 p-3 pt-3.5">
          {services.map((s, idx) => (
            <div
              key={s.id}
              aria-hidden
              className="h-[3px] flex-1 overflow-hidden rounded-full bg-white/20"
            >
                <div
                  className="h-full rounded-full bg-white/90 transition-transform duration-300"
                  style={{
                    transform: `scaleX(${idx < activeIndex ? 1 : idx === activeIndex && isActive ? 1 : 0})`,
                    transformOrigin: "left center",
                  }}
                />
              </div>
            ))}
        </div>

        <div className="relative z-10 flex h-full flex-col p-4">
          <div className="mt-8 flex items-center gap-2.5">
            <span
              className={`flex h-9 w-9 items-center justify-center rounded-full border bg-gold/12 text-gold ring-1 ring-black/30 transition-colors duration-300 ${
                isActive ? "border-gold/55" : "border-gold/35"
              }`}
            >
              <Icon className="h-4 w-4" aria-hidden />
            </span>
            <div>
              <p className="font-outfit text-[10px] font-semibold uppercase tracking-[0.2em] text-gold">
                {service.orderLabel}
              </p>
              <p className="font-display text-lg italic leading-tight text-white">{service.title}</p>
            </div>
          </div>

          <div className="mt-auto space-y-4 pb-1">
            <p className="label-upper text-[10px] text-gold/80">{profile.tagline}</p>
            <p className="text-sm leading-relaxed text-white/88">{profile.punchline}</p>

            <div className="flex flex-col gap-2.5 pt-1">
              <Link
                href={`/request/${service.slug}`}
                className="btn btn--primary btn--sm w-full"
                aria-label={`Request ${service.title}`}
              >
                Request
                <ArrowUpRight className="btn__icon btn__icon--nudge" aria-hidden />
              </Link>
              <Link
                href={
                  service.slug === "exterior"
                    ? "/projects?service=exterior"
                    : `/projects?service=${encodeURIComponent(service.slug)}`
                }
                className="btn btn--ghost btn--sm w-full"
              >
                View gallery
              </Link>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}


function ServicePanel({
  service,
  index,
  isActive,
  onActivate,
}: {
  service: (typeof services)[number];
  index: number;
  isActive: boolean;
  onActivate: () => void;
}) {
  const profile = serviceProfiles[service.title] ?? fallbackProfile;
  const visual = getServiceVisual(service.slug);
  const Icon = service.icon;

  return (
    <article
      className={`services-panel-card group/panel relative flex min-w-[min(100%,14rem)] shrink-0 cursor-pointer overflow-hidden sm:min-w-[min(100%,16rem)] lg:min-w-0 ${
        isActive
          ? "services-panel-card--active z-20 flex-[3] xl:flex-[3.5] 2xl:flex-[4] shadow-[inset_0_0_0_1px_rgba(245,197,24,0.45),0_0_40px_rgba(245,197,24,0.1)]"
          : "z-0 flex-1 hover:z-10"
      }`}
      onMouseEnter={onActivate}
      onFocus={onActivate}
      onClick={onActivate}
      tabIndex={0}
    >
      <div className="absolute inset-0 overflow-hidden">
        <ServicePanelMedia
          visual={visual}
          isPlaying={isActive}
          sizes={IMAGE_SIZES_DESKTOP}
          priority={index === 0}
        />
      </div>

      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(0,0,0,0.22) 0%, rgba(0,0,0,0.05) 38%, rgba(0,0,0,0.55) 100%)",
        }}
      />

      <div
        aria-hidden
        className={`pointer-events-none absolute inset-x-0 bottom-0 transition-[height] duration-500 ${
          isActive ? "h-[58%]" : "h-[42%]"
        }`}
        style={{
          background:
            "linear-gradient(to top, rgba(8,8,8,0.92) 0%, rgba(8,8,8,0.55) 45%, transparent 100%)",
        }}
      />

      <div
        aria-hidden
        className={`absolute inset-y-0 left-0 w-[3px] bg-gradient-to-b from-transparent via-gold to-transparent transition-opacity duration-300 ${
          isActive ? "opacity-100" : "opacity-0 group-hover/panel:opacity-50"
        }`}
      />

      <span
        aria-hidden
        className={`pointer-events-none absolute -right-2 top-1/2 -translate-y-1/2 select-none font-display text-[clamp(5rem,14vw,9rem)] italic leading-none transition-opacity duration-300 ${
          isActive
            ? "text-white/[0.07]"
            : "text-white/[0.04] group-hover/panel:text-white/[0.06]"
        }`}
      >
        {service.orderLabel}
      </span>

      <div className="relative z-10 flex h-full w-full flex-col p-4 sm:p-5 md:p-6 lg:p-7">
        <div className="flex items-start justify-between gap-3">
          <p
            className={`max-w-[90%] font-outfit text-[9px] font-semibold uppercase leading-snug tracking-[0.22em] transition-colors duration-300 sm:text-[10px] md:text-[11px] ${
              isActive ? "text-white" : "text-white/65 group-hover/panel:text-white/85"
            }`}
          >
            <span className="text-gold">{service.orderLabel}</span>
            <span className="mx-2 text-white/25">/</span>
            <span>{service.title}</span>
            <span className="mx-2 hidden text-white/25 lg:inline">/</span>
            <span className="hidden text-gold/75 lg:inline">{profile.tagline}</span>
          </p>

          <span
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border backdrop-blur-md transition-colors duration-300 sm:h-10 sm:w-10 ${
              isActive
                ? "border-gold/60 bg-gold/20 text-gold shadow-[0_0_20px_rgba(245, 197, 24,0.35)]"
                : "border-white/15 bg-black/35 text-white/70 group-hover/panel:border-gold/35 group-hover/panel:text-gold"
            }`}
          >
            <Icon className="h-4 w-4 sm:h-[18px] sm:w-[18px]" aria-hidden />
          </span>
        </div>

        <div className="mt-auto flex min-h-0 flex-1 items-end gap-4 pt-8">
          <h3
            className={`shrink-0 font-display text-[clamp(1.25rem,2.8vw,2.1rem)] italic leading-none tracking-[0.06em] [writing-mode:vertical-rl] rotate-180 transition-colors duration-300 ${
              isActive
                ? "text-gold drop-shadow-[0_0_28px_rgba(245, 197, 24,0.45)]"
                : "text-white/75 group-hover/panel:text-white"
            }`}
          >
            {profile.verticalLabel}
          </h3>

          <div
            className={`min-w-0 flex-1 transition-[opacity,transform] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
              isActive
                ? "translate-y-0 opacity-100"
                : "pointer-events-none translate-y-4 opacity-0"
            }`}
          >
            <div className="rounded-xl border border-white/10 bg-black/35 p-4 backdrop-blur-md sm:p-5">
              <p className="text-[11px] leading-relaxed text-white/88 sm:text-xs md:text-sm md:leading-relaxed">
                {profile.punchline}
              </p>

              <div className="mt-5 flex flex-wrap items-center gap-4 border-t border-white/10 pt-4">
                <Link
                  href={`/request/${service.slug}`}
                  className="btn btn--primary"
                  onClick={(e) => e.stopPropagation()}
                  aria-label={`Request ${service.title}`}
                >
                  Request
                  <ArrowUpRight className="btn__icon btn__icon--nudge" aria-hidden />
                </Link>
                <Link
                  href={
                  service.slug === "exterior"
                    ? "/projects?service=exterior"
                    : `/projects?service=${encodeURIComponent(service.slug)}`
                }
                  className="btn btn--ghost btn--sm"
                  onClick={(e) => e.stopPropagation()}
                >
                  Gallery
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {isActive && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-[2px] bg-gradient-to-r from-transparent via-gold to-transparent shadow-[0_0_16px_rgba(245, 197, 24,0.8)]"
        />
      )}
    </article>
  );
}
