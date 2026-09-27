"use client";

import {
  HERO_DESKTOP_MEDIA,
  HERO_DESKTOP_SIZES,
  HERO_IMAGE_QUALITY,
  HERO_MOBILE_MEDIA,
  HERO_MOBILE_SIZES,
  HERO_TABLET_MEDIA,
  HERO_TABLET_SIZES,
  hero,
} from "@/lib/hero-content";
import { getImageProps } from "next/image";
import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from "react";

export type HeroCinematicMediaHandle = {
  goToSlide: (index: number) => boolean;
};

type HeroSlide = (typeof hero.images)[number];

type HeroCinematicMediaProps = {
  slides: readonly HeroSlide[];
  reduceMotion: boolean;
  paused?: boolean;
  onSettled?: (index: number) => void;
};

function heroSrcSet(props: { srcSet?: string; src?: string }) {
  return props.srcSet || props.src || "";
}

function HeroSlidePicture({
  slide,
  priority,
  loading,
}: {
  slide: HeroSlide;
  priority: boolean;
  loading: "eager" | "lazy";
}) {
  const fetchPriority = (priority ? "high" : "auto") as "high" | "auto";
  const sharedFill = {
    alt: "",
    fill: true,
    quality: HERO_IMAGE_QUALITY,
    priority,
    fetchPriority,
  };

  const { props: mobileProps } = getImageProps({
    ...sharedFill,
    src: slide.srcMobile,
    sizes: HERO_MOBILE_SIZES,
  });

  const { props: tabletProps } = getImageProps({
    ...sharedFill,
    src: slide.srcTablet,
    sizes: HERO_TABLET_SIZES,
  });

  const { props: imgProps } = getImageProps({
    ...sharedFill,
    className: "hero-modern__img",
    src: slide.src,
    sizes: HERO_DESKTOP_SIZES,
  });

  return (
    <picture className="hero-modern__picture">
      <source media={HERO_MOBILE_MEDIA} srcSet={heroSrcSet(mobileProps)} sizes={HERO_MOBILE_SIZES} />
      <source media={HERO_TABLET_MEDIA} srcSet={heroSrcSet(tabletProps)} sizes={HERO_TABLET_SIZES} />
      <source media={HERO_DESKTOP_MEDIA} srcSet={heroSrcSet(imgProps)} sizes={HERO_DESKTOP_SIZES} />
      <img
        {...imgProps}
        alt=""
        draggable={false}
        loading={loading}
        decoding="async"
        style={{
          ...imgProps.style,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: slide.objectPosition,
        }}
      />
    </picture>
  );
}

function useMountedHeroSlides(slideCount: number, active: number, canRotate: boolean) {
  const [mounted, setMounted] = useState<Set<number>>(() => new Set([0]));

  useEffect(() => {
    setMounted((prev) => {
      const next = new Set(prev);
      next.add(active);
      if (canRotate && slideCount > 1) {
        next.add((active + 1) % slideCount);
      }
      return next;
    });
  }, [active, canRotate, slideCount]);

  useEffect(() => {
    if (!canRotate || slideCount < 2) return;

    const warmSecond = () => {
      setMounted((prev) => {
        if (prev.has(1)) return prev;
        const next = new Set(prev);
        next.add(1);
        return next;
      });
    };

    if (typeof window.requestIdleCallback === "function") {
      const idleId = window.requestIdleCallback(warmSecond, { timeout: 4000 });
      return () => window.cancelIdleCallback(idleId);
    }

    const timeoutId = window.setTimeout(warmSecond, 2500);
    return () => window.clearTimeout(timeoutId);
  }, [canRotate, slideCount]);

  const mountSlide = useCallback((index: number) => {
    setMounted((prev) => {
      if (prev.has(index)) return prev;
      const next = new Set(prev);
      next.add(index);
      return next;
    });
  }, []);

  return { mounted, mountSlide };
}

export const HeroCinematicMedia = forwardRef<HeroCinematicMediaHandle, HeroCinematicMediaProps>(
  function HeroCinematicMedia({ slides, reduceMotion, paused = false, onSettled }, ref) {
    const [active, setActive] = useState(0);
    const canRotate = !reduceMotion && slides.length > 1;
    const settledRef = useRef(onSettled);
    settledRef.current = onSettled;
    const { mounted: mountedSlides, mountSlide } = useMountedHeroSlides(slides.length, active, canRotate);

    const goToSlide = useCallback(
      (nextIndex: number) => {
        if (!canRotate) return false;
        if (nextIndex < 0 || nextIndex >= slides.length) return false;
        mountSlide(nextIndex);
        setActive((current) => {
          if (nextIndex === current) return current;
          settledRef.current?.(nextIndex);
          return nextIndex;
        });
        return true;
      },
      [canRotate, mountSlide, slides.length],
    );

    useImperativeHandle(ref, () => ({ goToSlide }), [goToSlide]);

    useEffect(() => {
      if (!canRotate || paused) return;

      const holdMs = slides[active]?.primary ? hero.primaryIntervalMs : hero.slideIntervalMs;
      const id = window.setTimeout(() => {
        const next = (active + 1) % slides.length;
        setActive(next);
        settledRef.current?.(next);
      }, holdMs);

      return () => window.clearTimeout(id);
    }, [active, canRotate, paused, slides]);

    const visibleSlides = canRotate ? slides : slides.slice(0, 1);

    return (
      <div className="hero-modern__media" aria-hidden>
        <div className="hero-modern__stage">
          {visibleSlides.map((slide, index) => (
            <div
              key={slide.alt}
              className={`hero-modern__layer${index === active ? " is-active" : ""}${
                slide.primary ? " hero-modern__layer--lead-zoom" : ""
              }${index === 1 ? " hero-modern__layer--zoom-from-top" : ""}`}
            >
              <div className="hero-modern__layer-inner">
                {mountedSlides.has(index) ? (
                  <HeroSlidePicture
                    slide={slide}
                    priority={index === 0}
                    loading={index === 0 ? "eager" : "lazy"}
                  />
                ) : null}
              </div>
            </div>
          ))}
        </div>
        <div className="hero-modern__scrim" />
      </div>
    );
  },
);
