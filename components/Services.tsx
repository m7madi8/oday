"use client";

import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { services } from "@/lib/data";
import { motion, useReducedMotion } from "@/components/ClientMotion";
import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import aboutImage from "@/imgs/about.jpg";
import interiorImage from "@/imgs/interior.jpg";
import exteriorImage from "@/imgs/exterior.jpg";

type ServiceProfile = {
  tagline: string;
  punchline: string;
  verticalLabel: string;
};

type ServiceVisual = {
  src: StaticImageData;
  alt: string;
  objectPosition: string;
};

const IMAGE_SIZES_DESKTOP = "(max-width: 1024px) 55vw, 65vw";
const IMAGE_SIZES_STORY = "(max-width: 768px) 85vw, 320px";
const IMAGE_QUALITY = 92;

const fallbackProfile: ServiceProfile = {
  tagline: "Oday scope",
  punchline: "Design-led scope with clear technical control from concept to delivery.",
  verticalLabel: "Architecture",
};

const serviceProfiles: Record<string, ServiceProfile> = {
  Interior: {
    tagline: "Interior systems",
    punchline:
      "Premium interiors built for brand value, material clarity, and execution-ready detailing.",
    verticalLabel: "Interior",
  },
  Exterior: {
    tagline: "Facade & landscape",
    punchline:
      "Facades, villas, residential buildings, and integrated landscape — tuned for climate, massing, and market appeal.",
    verticalLabel: "Exterior",
  },
  "Architecture Drone": {
    tagline: "Aerial intelligence",
    punchline:
      "Drone-powered site data and visual reporting for faster, sharper project decisions.",
    verticalLabel: "Drone",
  },
  "Architecture AI": {
    tagline: "AI workflows",
    punchline:
      "AI-enhanced architecture workflows for speed, option exploration, and precision.",
    verticalLabel: "AI Design",
  },
};

function getServiceVisual(title: string): ServiceVisual {
  const normalized = title.toLowerCase();

  if (normalized.includes("interior")) {
    return {
      src: interiorImage,
      alt: "Premium interior architecture with sculpted ceiling and warm lighting",
      objectPosition: "50% 42%",
    };
  }

  if (normalized.includes("exterior")) {
    return {
      src: exteriorImage,
      alt: "Contemporary exterior architecture with strong identity",
      objectPosition: "55% 40%",
    };
  }

  if (normalized.includes("drone")) {
    return {
      src: exteriorImage,
      alt: "Aerial architectural perspective for site intelligence",
      objectPosition: "62% 28%",
    };
  }

  if (normalized.includes("ai")) {
    return {
      src: interiorImage,
      alt: "Digital architecture scene symbolizing AI-powered workflows",
      objectPosition: "48% 35%",
    };
  }

  return {
    src: aboutImage,
    alt: "Modern architecture with balanced interior and exterior expression",
    objectPosition: "50% 40%",
  };
}

const stripBezel =
  "rounded-[1.1rem] bg-gradient-to-br from-gold/55 via-white/25 to-gold/20 p-[2px] shadow-[0_40px_100px_rgba(0,0,0,0.65),0_0_0_1px_rgba(245, 197, 24,0.12)] lg:rounded-[1.25rem] lg:p-[3px]";

const stripInner =
  "flex h-[clamp(420px,68vh,760px)] min-h-[400px] w-full overflow-hidden rounded-[1.02rem] bg-transparent lg:rounded-[1.15rem]";

type StoryCardMotion = {
  focus: number;
  drift: number;
};

const storyEase = { type: "tween" as const, duration: 0.55, ease: [0.22, 1, 0.36, 1] as const };

function buildStoryMotions(el: HTMLDivElement): StoryCardMotion[] {
  const center = el.scrollLeft + el.clientWidth / 2;
  const half = Math.max(el.clientWidth / 2, 1);

  return Array.from(el.children).map((child) => {
    const card = child as HTMLElement;
    const cardCenter = card.offsetLeft + card.offsetWidth / 2;
    const drift = Math.max(-1, Math.min(1, (cardCenter - center) / half));
    const focus = Math.max(0, 1 - Math.abs(drift) * 0.94);
    return { focus, drift };
  });
}

export function Services() {
  const reduceMotion = useReducedMotion();
  const [activeId, setActiveId] = useState(services[0]?.id ?? "");
  const [storyIndex, setStoryIndex] = useState(0);
  const [storyMotions, setStoryMotions] = useState<StoryCardMotion[]>(() =>
    services.map((_, i) => ({ focus: i === 0 ? 1 : 0, drift: i === 0 ? 0 : 0.4 })),
  );
  const storyScrollerRef = useRef<HTMLDivElement>(null);
  const storyRafRef = useRef(0);

  const syncStoryScroll = useCallback(() => {
    const el = storyScrollerRef.current;
    if (!el || !el.children.length) return;

    const motions = buildStoryMotions(el);
    setStoryMotions(motions);

    let closest = 0;
    let minDist = Infinity;
    motions.forEach((m, i) => {
      const focusDist = 1 - m.focus;
      if (focusDist < minDist) {
        minDist = focusDist;
        closest = i;
      }
    });
    setStoryIndex(closest);
  }, []);

  useEffect(() => {
    const el = storyScrollerRef.current;
    if (!el) return;

    syncStoryScroll();

    const onScroll = () => {
      cancelAnimationFrame(storyRafRef.current);
      storyRafRef.current = requestAnimationFrame(syncStoryScroll);
    };

    el.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", syncStoryScroll);

    return () => {
      cancelAnimationFrame(storyRafRef.current);
      el.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", syncStoryScroll);
    };
  }, [syncStoryScroll]);

  if (!services.length) return null;

  function scrollToStory(index: number) {
    const el = storyScrollerRef.current;
    const child = el?.children[index] as HTMLElement | undefined;
    if (!el || !child) return;
    const left = child.offsetLeft - (el.clientWidth - child.offsetWidth) / 2;
    el.scrollTo({
      left: Math.max(0, left),
      behavior: reduceMotion ? "auto" : "smooth",
    });
    setStoryIndex(index);
  }

  return (
    <section
      id="services"
      className="relative isolate overflow-hidden bg-bg-primary py-20 md:py-28"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,rgba(245, 197, 24,0.14),transparent_55%)]"
      />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -left-40 top-16 h-80 w-80 rounded-full bg-gold/16 blur-3xl"
        animate={reduceMotion ? undefined : { x: [0, 32, 0], y: [0, -18, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -right-32 bottom-0 h-72 w-72 rounded-full bg-gold/10 blur-3xl"
        animate={reduceMotion ? undefined : { x: [0, -28, 0], y: [0, 16, 0] }}
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="relative mx-auto w-full max-w-[100rem] px-4 md:px-8 lg:px-10">
        <ScrollReveal dramatic className="mx-auto max-w-3xl text-center md:max-w-4xl">
          <p className="label-upper text-gold">Solutions</p>
          <h2 className="mt-4 font-display text-[clamp(2.1rem,5vw,4rem)] italic leading-[0.95] text-ink-primary">
            Four disciplines.
            <span className="mt-2 block bg-gradient-to-r from-gold via-[#fff3b0] to-gold/70 bg-clip-text text-transparent">
              One cinematic frame.
            </span>
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-sm leading-relaxed text-ink-secondary md:text-base">
            <span className="md:hidden">Swipe through story-sized service cards.</span>
            <span className="hidden md:inline">
              Every service in one frame â€” hover any column to reveal its story.
            </span>
          </p>
        </ScrollReveal>

        {/* Mobile: Instagram story ratio cards */}
        <ScrollReveal dramatic delay={0.06} className="mt-10 md:hidden">
          <div className="overflow-hidden rounded-[1.35rem]">
          <motion.div
            ref={storyScrollerRef}
            className="flex snap-x snap-mandatory gap-0 overflow-x-auto overflow-y-hidden overscroll-x-contain scroll-smooth touch-pan-x py-2 [-ms-overflow-style:none] [scrollbar-width:none] [-webkit-overflow-scrolling:touch] [&::-webkit-scrollbar]:hidden"
            aria-label="Services stories"
          >
            {services.map((service, index) => (
              <ServiceStoryCard
                key={service.id}
                service={service}
                index={index}
                motionState={storyMotions[index] ?? { focus: 0, drift: 0 }}
                isCentered={storyIndex === index}
                reduceMotion={!!reduceMotion}
              />
            ))}
          </motion.div>
          </div>

          <div className="mt-5 flex justify-center gap-2" role="tablist" aria-label="Service stories">
            {services.map((service, index) => (
              <button
                key={service.id}
                type="button"
                data-no-glow
                role="tab"
                aria-selected={storyIndex === index}
                aria-label={`Go to ${service.title}`}
                onClick={() => scrollToStory(index)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  storyIndex === index ? "w-7 bg-gold" : "w-1.5 bg-gold/35"
                }`}
              />
            ))}
          </div>
        </ScrollReveal>

        {/* Desktop: panoramic accordion strip */}
        <ScrollReveal dramatic delay={0.06} className="mt-11 hidden md:block">
          <div className={stripBezel}>
            <div
              className={stripInner}
              onMouseLeave={() => setActiveId(services[0]?.id ?? "")}
            >
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
        </ScrollReveal>

        <ScrollReveal
          dramatic
          delay={0.1}
          className="mt-10 rounded-2xl border border-gold/28 bg-gradient-to-r from-bg-card/95 via-bg-card/88 to-bg-card/95 p-5 shadow-[0_16px_48px_rgba(0,0,0,0.35)] backdrop-blur-sm md:flex md:items-center md:justify-between md:gap-6 md:px-7"
        >
          <p className="text-sm text-ink-secondary md:text-base">
            Need a custom mix? We can combine design, engineering, drone, and AI in one clean workflow.
          </p>
          <Link
            href="#contact"
            className="mt-4 inline-flex items-center justify-center rounded-full border border-gold/50 bg-gold/20 px-7 py-3 text-xs uppercase tracking-[0.2em] text-ink-primary shadow-[0_8px_28px_rgba(245, 197, 24,0.2)] transition-all hover:bg-gold/28 hover:shadow-[0_12px_36px_rgba(245, 197, 24,0.28)] md:mt-0"
            aria-label="Build custom service scope"
          >
            Build My Scope
          </Link>
        </ScrollReveal>
      </div>
    </section>
  );
}

/** 9:16 story card â€” soft scroll focus */
function ServiceStoryCard({
  service,
  index,
  motionState,
  isCentered,
  reduceMotion,
}: {
  service: (typeof services)[number];
  index: number;
  motionState: StoryCardMotion;
  isCentered: boolean;
  reduceMotion: boolean;
}) {
  const profile = serviceProfiles[service.title] ?? fallbackProfile;
  const visual = getServiceVisual(service.title);
  const Icon = service.icon;

  const { focus } = motionState;
  const scale = reduceMotion ? 1 : 0.97 + focus * 0.03;
  const opacity = reduceMotion ? 1 : 0.88 + focus * 0.12;
  const liftY = reduceMotion ? 0 : (1 - focus) * 5;

  return (
    <motion.article
      className="relative aspect-[9/16] w-[min(78vw,300px)] shrink-0 snap-center overflow-hidden bg-transparent px-0.5"
      style={{ zIndex: Math.round(focus * 10) }}
      animate={{ scale, opacity, y: liftY }}
      transition={reduceMotion ? { duration: 0 } : storyEase}
    >
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-[1.12rem]"
        animate={{ opacity: isCentered && !reduceMotion ? 0.1 + focus * 0.08 : 0 }}
        transition={storyEase}
        style={{
          boxShadow: isCentered ? "0 0 28px rgba(245, 197, 24,0.14)" : "none",
        }}
      />

      <div className="relative h-full w-full overflow-hidden rounded-[1.12rem] shadow-[0_16px_40px_rgba(0,0,0,0.35)] ring-1 ring-white/[0.08]">
        <motion.div
          className="absolute inset-0"
          animate={{ scale: reduceMotion ? 1 : 1.02 + focus * 0.02 }}
          transition={storyEase}
        >
          <Image
            src={visual.src}
            alt={visual.alt}
            fill
            quality={IMAGE_QUALITY}
            sizes={IMAGE_SIZES_STORY}
            priority={index < 2}
            className="object-cover brightness-[1.03] contrast-[1.02] saturate-[1.06]"
            style={{ objectPosition: visual.objectPosition }}
          />
        </motion.div>

        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.06) 34%, rgba(0,0,0,0.12) 58%, rgba(0,0,0,0.82) 100%)",
          }}
        />

        <div className="absolute inset-x-0 top-0 z-20 flex gap-1 p-3 pt-3.5">
          {services.map((s) => {
            const isCurrent = s.id === service.id;
            return (
              <div
                key={s.id}
                aria-hidden
                className="h-[3px] flex-1 overflow-hidden rounded-full bg-white/20"
              >
                <motion.div
                  className="h-full rounded-full bg-white/90"
                  initial={false}
                  animate={{
                    scaleX: isCurrent && isCentered ? 1 : isCurrent ? 0.5 + focus * 0.35 : 0,
                  }}
                  style={{ transformOrigin: "left center" }}
                  transition={storyEase}
                />
              </div>
            );
          })}
        </div>

        <div className="relative z-10 flex h-full flex-col p-4">
          <div className="mt-8 flex items-center gap-2.5">
              <span
                className={`flex h-9 w-9 items-center justify-center rounded-full border bg-gold/12 text-gold ring-1 ring-black/30 transition-colors duration-500 ${
                  isCentered ? "border-gold/55" : "border-gold/35"
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

          <motion.div className="mt-auto space-y-4 pb-1">
            <p className="label-upper text-[10px] text-gold/80">{profile.tagline}</p>
            <p className="text-sm leading-relaxed text-white/88">{profile.punchline}</p>

            <div className="flex flex-col gap-2.5 pt-1">
              <Link
                href={`/request/${service.slug}`}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-gold/50 bg-gold/20 py-3 text-[11px] uppercase tracking-[0.16em] text-white transition-colors hover:bg-gold/30"
                aria-label={`Request ${service.title}`}
              >
                Request
                <ArrowUpRight className="h-4 w-4" aria-hidden />
              </Link>
              <Link
                href={
                  service.slug === "exterior"
                    ? "/projects?service=exterior"
                    : `/projects?service=${encodeURIComponent(service.slug)}`
                }
                className="inline-flex items-center justify-center rounded-full border border-white/25 py-2.5 text-[10px] uppercase tracking-[0.14em] text-white/75 transition-colors hover:border-gold/40 hover:text-gold"
              >
                View gallery
              </Link>
            </div>

            <p className="text-center font-outfit text-[10px] uppercase tracking-[0.28em] text-white/40">
              Swipe
            </p>
          </motion.div>
        </div>
      </div>
    </motion.article>
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
  const visual = getServiceVisual(service.title);
  const Icon = service.icon;

  return (
    <article
      className={`group/panel relative flex min-w-0 cursor-pointer overflow-hidden transition-[flex-grow,box-shadow] duration-[850ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${
        isActive
          ? "z-20 flex-[3] shadow-[inset_0_0_0_1px_rgba(245, 197, 24,0.45),0_0_60px_rgba(245, 197, 24,0.12)]"
          : "z-0 flex-1 hover:z-10"
      }`}
      onMouseEnter={onActivate}
      onFocus={onActivate}
      onClick={onActivate}
      tabIndex={0}
    >
      <div className="absolute inset-0 overflow-hidden">
        <Image
          src={visual.src}
          alt={visual.alt}
          fill
          quality={IMAGE_QUALITY}
          sizes={IMAGE_SIZES_DESKTOP}
          priority={index < 3}
          className={`object-cover transition-[transform,filter] duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${
            isActive
              ? "scale-[1.04] brightness-[1.08] contrast-[1.06] saturate-[1.14]"
              : "scale-100 brightness-[0.92] contrast-[1.02] saturate-[0.95] group-hover/panel:brightness-[1] group-hover/panel:saturate-[1.05]"
          }`}
          style={{ objectPosition: visual.objectPosition }}
        />
      </div>

      <motion.div
        aria-hidden
        className={`pointer-events-none absolute inset-0 transition-opacity duration-700 ${
          isActive ? "opacity-100" : "opacity-80"
        }`}
        style={{
          background:
            "linear-gradient(180deg, rgba(0,0,0,0.22) 0%, rgba(0,0,0,0.05) 38%, rgba(0,0,0,0.55) 100%)",
        }}
      />

      <motion.div
        aria-hidden
        className={`pointer-events-none absolute inset-x-0 bottom-0 transition-all duration-700 ${
          isActive ? "h-[58%]" : "h-[42%]"
        }`}
        style={{
          background:
            "linear-gradient(to top, rgba(8,8,8,0.92) 0%, rgba(8,8,8,0.55) 45%, transparent 100%)",
        }}
      />

      <motion.div
        aria-hidden
        className={`absolute inset-y-0 left-0 w-[4px] bg-gradient-to-b from-transparent via-gold to-transparent shadow-[0_0_24px_rgba(245, 197, 24,0.55)] transition-all duration-500 ${
          isActive ? "opacity-100" : "opacity-0 group-hover/panel:opacity-60"
        }`}
      />

      <span
        aria-hidden
        className={`pointer-events-none absolute -right-2 top-1/2 -translate-y-1/2 select-none font-display text-[clamp(5rem,14vw,9rem)] italic leading-none transition-all duration-700 ${
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
            className={`max-w-[90%] font-outfit text-[9px] font-semibold uppercase leading-snug tracking-[0.22em] transition-all duration-500 sm:text-[10px] md:text-[11px] ${
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
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border backdrop-blur-md transition-all duration-500 sm:h-10 sm:w-10 ${
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
            className={`shrink-0 font-display text-[clamp(1.25rem,2.8vw,2.1rem)] italic leading-none tracking-[0.06em] [writing-mode:vertical-rl] rotate-180 transition-all duration-700 ${
              isActive
                ? "text-gold drop-shadow-[0_0_28px_rgba(245, 197, 24,0.45)]"
                : "text-white/75 group-hover/panel:text-white"
            }`}
          >
            {profile.verticalLabel}
          </h3>

          <div
            className={`min-w-0 flex-1 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
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
                  className="group/link label-upper inline-flex items-center gap-2 rounded-full border border-gold/45 bg-gold/12 px-5 py-2.5 font-display text-[clamp(1rem,2.2vw,1.35rem)] italic leading-none text-white transition-colors hover:text-gold"
                  onClick={(e) => e.stopPropagation()}
                  aria-label={`Request ${service.title}`}
                >
                  Request
                  <ArrowUpRight
                    className="h-5 w-5 shrink-0 transition-transform duration-300 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 sm:h-6 sm:w-6"
                    aria-hidden
                  />
                </Link>
                <Link
                  href={
                  service.slug === "exterior"
                    ? "/projects?service=exterior"
                    : `/projects?service=${encodeURIComponent(service.slug)}`
                }
                  className="label-upper rounded-full border border-gold/35 bg-gold/10 px-4 py-2 text-[10px] text-gold/90 transition-all hover:border-gold/55 hover:bg-gold/20"
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
