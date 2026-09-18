"use client";

import {
  HERO_DESKTOP_SIZES,
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

const HERO_QUALITY = 96;

function HeroSlidePicture({ slide, priority }: { slide: HeroSlide; priority: boolean }) {
  const shared = {
    alt: "",
    fill: true,
    quality: HERO_QUALITY,
    className: "hero-modern__img object-cover",
    priority,
    fetchPriority: (priority ? "high" : "auto") as "high" | "auto",
  };

  const {
    props: { srcSet: mobileSrcSet },
  } = getImageProps({ ...shared, src: slide.srcMobile, sizes: HERO_MOBILE_SIZES });

  const {
    props: { srcSet: tabletSrcSet },
  } = getImageProps({ ...shared, src: slide.srcTablet, sizes: HERO_TABLET_SIZES });

  const { props: imgProps } = getImageProps({
    ...shared,
    src: slide.src,
    sizes: HERO_DESKTOP_SIZES,
  });

  return (
    <picture className="hero-modern__picture">
      <source media={HERO_MOBILE_MEDIA} srcSet={mobileSrcSet} sizes={HERO_MOBILE_SIZES} />
      <source media={HERO_TABLET_MEDIA} srcSet={tabletSrcSet} sizes={HERO_TABLET_SIZES} />
      <img
        {...imgProps}
        alt=""
        draggable={false}
        style={{
          ...imgProps.style,
          objectPosition: slide.objectPosition,
        }}
      />
    </picture>
  );
}

export const HeroCinematicMedia = forwardRef<HeroCinematicMediaHandle, HeroCinematicMediaProps>(
  function HeroCinematicMedia({ slides, reduceMotion, paused = false, onSettled }, ref) {
    const [active, setActive] = useState(0);
    const canRotate = !reduceMotion && slides.length > 1;
    const settledRef = useRef(onSettled);
    settledRef.current = onSettled;

    const goToSlide = useCallback(
      (nextIndex: number) => {
        if (!canRotate) return false;
        if (nextIndex < 0 || nextIndex >= slides.length) return false;
        setActive((current) => {
          if (nextIndex === current) return current;
          settledRef.current?.(nextIndex);
          return nextIndex;
        });
        return true;
      },
      [canRotate, slides.length],
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
              className={`hero-modern__layer${index === active ? " is-active" : ""}`}
            >
              <div className="hero-modern__layer-inner">
                <HeroSlidePicture slide={slide} priority={index === 0} />
              </div>
            </div>
          ))}
        </div>
        <div className="hero-modern__scrim" />
      </div>
    );
  },
);
