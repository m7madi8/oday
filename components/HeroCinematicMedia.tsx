"use client";

import {
  HERO_DESKTOP_MEDIA,
  HERO_CAROUSEL_QUALITY,
  HERO_DESKTOP_SIZES,
  HERO_LCP_DESKTOP_SIZES,
  HERO_LCP_QUALITY,
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

const CROSSFADE_MS = 520;

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
  const quality = priority ? HERO_LCP_QUALITY : HERO_CAROUSEL_QUALITY;
  const desktopSizes = priority ? HERO_LCP_DESKTOP_SIZES : HERO_DESKTOP_SIZES;
  const sharedFill = {
    alt: "",
    fill: true,
    quality,
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
    sizes: desktopSizes,
  });

  return (
    <picture className="hero-modern__picture">
      <source media={HERO_MOBILE_MEDIA} srcSet={heroSrcSet(mobileProps)} sizes={HERO_MOBILE_SIZES} />
      <source media={HERO_TABLET_MEDIA} srcSet={heroSrcSet(tabletProps)} sizes={HERO_TABLET_SIZES} />
      <source media={HERO_DESKTOP_MEDIA} srcSet={heroSrcSet(imgProps)} sizes={desktopSizes} />
      <img
        {...imgProps}
        alt=""
        draggable={false}
        loading={loading}
        decoding={priority ? "sync" : "async"}
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

export const HeroCinematicMedia = forwardRef<HeroCinematicMediaHandle, HeroCinematicMediaProps>(
  function HeroCinematicMedia({ slides, reduceMotion, paused = false, onSettled }, ref) {
    const [active, setActive] = useState(0);
    const [previous, setPrevious] = useState<number | null>(null);
    const clearPreviousRef = useRef<number | null>(null);
    const canRotate = !reduceMotion && slides.length > 1;
    const settledRef = useRef(onSettled);
    settledRef.current = onSettled;

    const commitSlide = useCallback(
      (nextIndex: number) => {
        if (nextIndex < 0 || nextIndex >= slides.length) return;
        setActive((current) => {
          if (nextIndex === current) return current;
          if (clearPreviousRef.current) {
            window.clearTimeout(clearPreviousRef.current);
            clearPreviousRef.current = null;
          }
          if (reduceMotion) {
            setPrevious(null);
          } else {
            setPrevious(current);
            clearPreviousRef.current = window.setTimeout(() => {
              setPrevious(null);
              clearPreviousRef.current = null;
            }, CROSSFADE_MS);
          }
          settledRef.current?.(nextIndex);
          return nextIndex;
        });
      },
      [reduceMotion, slides.length],
    );

    const goToSlide = useCallback(
      (nextIndex: number) => {
        if (!canRotate) return false;
        if (nextIndex < 0 || nextIndex >= slides.length) return false;
        commitSlide(nextIndex);
        return true;
      },
      [canRotate, commitSlide, slides.length],
    );

    useImperativeHandle(ref, () => ({ goToSlide }), [goToSlide]);

    useEffect(() => {
      return () => {
        if (clearPreviousRef.current) window.clearTimeout(clearPreviousRef.current);
      };
    }, []);

    useEffect(() => {
      if (!canRotate || paused) return;

      const holdMs = slides[active]?.primary ? hero.primaryIntervalMs : hero.slideIntervalMs;
      const id = window.setTimeout(() => {
        commitSlide((active + 1) % slides.length);
      }, holdMs);

      return () => window.clearTimeout(id);
    }, [active, canRotate, commitSlide, paused, slides]);

    const slideCount = canRotate ? slides.length : 1;

    return (
      <div className="hero-modern__media" aria-hidden>
        <div className="hero-modern__stage">
          {slides.slice(0, slideCount).map((slide, index) => {
            const isActive = index === active;
            const isPrevious = index === previous;
            return (
              <div
                key={slide.alt}
                className={`hero-modern__layer${isActive ? " is-active" : ""}${
                  isPrevious ? " is-previous" : ""
                }${reduceMotion ? " hero-modern__layer--instant" : ""}${
                  slide.primary ? " hero-modern__layer--lead-zoom" : ""
                }${index === 1 ? " hero-modern__layer--zoom-from-top" : ""}`}
              >
                <div className="hero-modern__layer-inner">
                  <HeroSlidePicture
                    slide={slide}
                    priority={index === 0}
                    loading={index === 0 ? "eager" : "eager"}
                  />
                </div>
              </div>
            );
          })}
        </div>
        <div className="hero-modern__scrim" />
      </div>
    );
  },
);
