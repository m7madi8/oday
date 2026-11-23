"use client";

import { ServicePanelMedia } from "@/components/ServicePanelMedia";
import { SectionHeader, SectionInner, SectionShell } from "@/components/SectionShell";
import { services } from "@/lib/content/services";
import { serviceVisualBySlug } from "@/lib/content/service-visuals";
import { SafeButton } from "@/components/SafeButton";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useRef, useState } from "react";
import { useInView, useReducedMotion } from "@/components/ClientMotion";
import { useMobilePerfMode } from "@/hooks/useMobilePerfMode";
import { usePageScrollBusy } from "@/hooks/usePageScrollBusy";

const IMAGE_SIZES_DESK = "(max-width: 1536px) 24vw, 520px";
const IMAGE_SIZES_STORY =
  "(max-width: 767px) 100vw, (max-width: 1023px) 78vw, 420px";

const STORY_CARD_SCRIM =
  "linear-gradient(180deg, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.06) 34%, rgba(0,0,0,0.12) 58%, rgba(0,0,0,0.82) 100%)";

const DESK_CARD_SCRIM =
  "linear-gradient(180deg, rgba(0,0,0,0.58) 0%, rgba(0,0,0,0.14) 24%, rgba(0,0,0,0) 46%, rgba(0,0,0,0.22) 100%)";

function serviceGalleryHref(slug: (typeof services)[number]["slug"]) {
  return `/projects?service=${encodeURIComponent(slug)}`;
}

function getServiceVisual(slug: (typeof services)[number]["slug"]) {
  return serviceVisualBySlug[slug];
}

export function Services() {
  if (!services.length) return null;

  return (
    <SectionShell id="services" snap={false} containOverflow={false} className="services-section">
      <SectionInner className="services-section__head">
        <div className="section-editorial-head">
          <span className="section-editorial-head__index" aria-hidden>
            03
          </span>
          <SectionHeader
            eyebrow="Solutions"
            titleClassName="section-title--editorial"
            title={
              <>
                Four disciplines.
                <span className="mt-1 block bg-gradient-to-r from-gold via-[#fff3b0] to-gold/70 bg-clip-text text-transparent">
                  One cinematic frame.
                </span>
              </>
            }
          />
        </div>
      </SectionInner>

      {/* Phone + iPad — story carousel (no scroll-reveal wrapper — lighter on touch scroll) */}
      <div className="services-carousel-wrap lg:hidden">
        <ServicesMobileCarousel />
      </div>

      <ServicesDesktopBoard />
    </SectionShell>
  );
}

const SWIPE_THRESHOLD_PX = 48;

function ServicesMobileCarousel() {
  const reduceMotion = useReducedMotion();
  const mobilePerf = useMobilePerfMode();
  const scrollBusy = usePageScrollBusy();
  const carouselRef = useRef<HTMLDivElement>(null);
  const carouselInView = useInView(carouselRef, {
    once: false,
    amount: 0.12,
    margin: "0px 0px -8% 0px",
  });
  const [activeIndex, setActiveIndex] = useState(0);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  const pauseHeavyMedia = mobilePerf && (scrollBusy || !carouselInView);

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
    <div ref={carouselRef} className="services-carousel">
      <div className="services-carousel__stage">
        <SafeButton
          data-no-glow
          type="button"
          className="services-carousel__nav services-carousel__nav--prev"
          aria-label="Previous discipline"
          disabled={activeIndex === 0}
          onClick={() => goTo(activeIndex - 1)}
        >
          <ChevronLeft className="h-5 w-5" strokeWidth={1.6} aria-hidden />
        </SafeButton>

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
              transform: `translate3d(calc(var(--svc-side) - ${activeIndex} * (var(--svc-slide) + var(--svc-gap))), 0, 0)`,
              transition: reduceMotion ? "none" : undefined,
            }}
          >
            {services.map((service, index) => {
              const isActive = activeIndex === index;
              const shouldMount = mobilePerf
                ? Math.abs(index - activeIndex) <= 1
                : true;

              return (
                <div
                  key={service.id}
                  className={`services-carousel__slide${isActive ? " is-active" : ""}`}
                  aria-hidden={!isActive}
                  onClick={() => {
                    if (!isActive) goTo(index);
                  }}
                >
                  {shouldMount ? (
                    <ServiceStoryCard
                      service={service}
                      index={index}
                      isActive={isActive && !pauseHeavyMedia}
                      activeIndex={activeIndex}
                      liteMedia={mobilePerf}
                      priority={index === 0}
                    />
                  ) : (
                    <div className="services-story-card services-story-card--shell" aria-hidden />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <SafeButton
          data-no-glow
          type="button"
          className="services-carousel__nav services-carousel__nav--next"
          aria-label="Next discipline"
          disabled={activeIndex === services.length - 1}
          onClick={() => goTo(activeIndex + 1)}
        >
          <ChevronRight className="h-5 w-5" strokeWidth={1.6} aria-hidden />
        </SafeButton>
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
  index,
  isActive,
  activeIndex,
  priority = false,
  liteMedia = false,
}: {
  service: (typeof services)[number];
  index: number;
  isActive: boolean;
  activeIndex: number;
  priority?: boolean;
  liteMedia?: boolean;
}) {
  const visual = getServiceVisual(service.slug);
  const Icon = service.icon;
  const router = useRouter();
  const prefetchVideo =
    !liteMedia &&
    !isActive &&
    Boolean(visual.videoSrc) &&
    Math.abs(activeIndex - index) === 1;

  return (
    <article
      className={`services-story-card relative h-full w-full shrink-0 cursor-pointer bg-transparent${
        isActive ? " services-story-card--active" : ""
      }`}
      onClick={(event) => {
        if (!isActive) return;
        if ((event.target as HTMLElement).closest("a,button")) return;
        router.push(serviceGalleryHref(service.slug));
      }}
    >
      <div className="services-story-card__frame relative h-full w-full overflow-hidden rounded-[1.12rem] shadow-[0_16px_40px_rgba(0,0,0,0.35)] ring-1 ring-white/[0.08]">
        <div className="absolute inset-0">
          <ServicePanelMedia
            visual={visual}
            isPlaying={isActive}
            prefetch={prefetchVideo}
            sizes={IMAGE_SIZES_STORY}
            priority={priority}
            lite={liteMedia}
            imageClassName="services-panel-image object-cover brightness-[1.03] contrast-[1.02] saturate-[1.06]"
          />
        </div>

        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{ background: STORY_CARD_SCRIM }}
        />

        <div className="services-story-card__ticks absolute inset-x-0 top-0 z-20 flex gap-1 p-3 pt-3.5">
          {services.map((s, idx) => (
            <div
              key={s.id}
              aria-hidden
              className="services-story-card__tick h-[3px] flex-1 overflow-hidden rounded-full bg-white/20"
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

        <div className="services-story-card__body relative z-10 flex h-full flex-col p-4">
          <div className="services-story-card__meta mt-8 flex items-center gap-2.5">
            <span
              className={`services-story-card__icon flex h-9 w-9 items-center justify-center rounded-full border bg-gold/12 text-gold ring-1 ring-black/30 transition-colors duration-300 ${
                isActive ? "border-gold/55" : "border-gold/35"
              }`}
            >
              <Icon className="h-4 w-4" aria-hidden />
            </span>
            <div className="min-w-0">
              <p className="services-story-card__order font-ui text-xs font-semibold uppercase tracking-[0.2em] text-gold">
                {service.orderLabel}
              </p>
              <p className="services-story-card__title font-display text-sm leading-tight text-white">
                {service.title}
              </p>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

function ServicesDesktopBoard() {
  const [activeId, setActiveId] = useState<string | null>(null);

  return (
    <div className="services-desk hidden lg:grid" onMouseLeave={() => setActiveId(null)}>
      {services.map((service, index) => (
        <ServiceDeskCard
          key={service.id}
          service={service}
          index={index}
          isActive={activeId === service.id}
          onActivate={() => setActiveId(service.id)}
          onQuiet={() => setActiveId((current) => (current === service.id ? null : current))}
        />
      ))}
    </div>
  );
}

function ServiceDeskCard({
  service,
  index,
  isActive,
  onActivate,
  onQuiet,
}: {
  service: (typeof services)[number];
  index: number;
  isActive: boolean;
  onActivate: () => void;
  onQuiet: () => void;
}) {
  const visual = getServiceVisual(service.slug);
  const Icon = service.icon;
  const router = useRouter();
  const galleryHref = serviceGalleryHref(service.slug);

  return (
    <article
      className={`services-desk-card${isActive ? " is-active" : ""}`}
      onMouseEnter={onActivate}
      onFocus={onActivate}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
          onQuiet();
        }
      }}
      onClick={(event) => {
        if ((event.target as HTMLElement).closest("a,button")) return;
        router.push(galleryHref);
      }}
      onKeyDown={(event) => {
        if (event.key !== "Enter" && event.key !== " ") return;
        event.preventDefault();
        router.push(galleryHref);
      }}
      tabIndex={0}
      aria-label={`View ${service.title} projects`}
    >
      <div className="services-desk-card__frame">
        <div className="services-desk-card__media">
          <ServicePanelMedia
            visual={visual}
            isPlaying={isActive}
            sizes={IMAGE_SIZES_DESK}
            priority={index === 0}
            imageClassName="services-panel-image object-cover"
          />
        </div>

        <div aria-hidden className="services-desk-card__scrim" style={{ background: DESK_CARD_SCRIM }} />

        <div className="services-desk-card__ticks" aria-hidden>
          {services.map((item, tickIndex) => (
            <span key={item.id} className="services-desk-card__tick">
              <span
                className="services-desk-card__tick-fill"
                style={{ transform: `scaleX(${tickIndex === index ? 1 : 0})` }}
              />
            </span>
          ))}
        </div>

        <div className="services-desk-card__meta">
          <span className={`services-desk-card__icon${isActive ? " is-active" : ""}`}>
            <Icon aria-hidden />
          </span>
          <span className="services-desk-card__copy">
            <span className="services-desk-card__order">{service.orderLabel}</span>
            <span className="services-desk-card__title">{service.title}</span>
          </span>
        </div>
      </div>
    </article>
  );
}
