"use client";

import { useGSAP, type GsapLike } from "@/hooks/useGSAP";
import { hero } from "@/lib/hero-content";
import Image from "next/image";
import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef } from "react";

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

type Killable = { kill?: () => void };

type TimelineLike = {
  to: (target: unknown, vars: Record<string, unknown>, position?: number | string) => TimelineLike;
  set: (target: unknown, vars: Record<string, unknown>) => TimelineLike;
  kill: () => void;
};

const CLIP_OPEN = "polygon(-8% -4%, 108% -4%, 108% 104%, -8% 104%)";
const CLIP_INSET_OPEN = "inset(0% 0% 0% 0%)";

const DESKTOP_MS = 1.55;
const MOBILE_MS = 1.28;

function isSimplifiedViewport() {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
    return true;
  }

  return (
    window.matchMedia("(max-width: 1023px)").matches ||
    window.matchMedia("(pointer: coarse)").matches
  );
}

function incomingClip(forward: boolean, diagonal: boolean, simple: boolean) {
  if (simple) {
    return forward ? "inset(0% 0% 0% 100%)" : "inset(0% 100% 0% 0%)";
  }

  if (forward) {
    return diagonal
      ? "polygon(108% -4%, 108% -4%, 100% 104%, 100% 104%)"
      : "polygon(100% -4%, 100% -4%, 100% 104%, 100% 104%)";
  }

  return diagonal
    ? "polygon(-8% -4%, -8% -4%, 0% 104%, 0% 104%)"
    : "polygon(0% -4%, 0% -4%, 0% 104%, 0% 104%)";
}

function openClip(simple: boolean) {
  return simple ? CLIP_INSET_OPEN : CLIP_OPEN;
}

function killTween(target: unknown) {
  if (target && typeof target === "object" && "kill" in target) {
    (target as Killable).kill?.();
  }
}

export const HeroCinematicMedia = forwardRef<HeroCinematicMediaHandle, HeroCinematicMediaProps>(
  function HeroCinematicMedia({ slides, reduceMotion, paused = false, onSettled }, ref) {
    const rootRef = useRef<HTMLDivElement>(null);
    const stageRef = useRef<HTMLDivElement>(null);
    const layerRefs = useRef<Array<HTMLDivElement | null>>([]);
    const innerRefs = useRef<Array<HTMLDivElement | null>>([]);
    const gsapRef = useRef<GsapLike | null>(null);
    const indexRef = useRef(0);
    const busyRef = useRef(false);
    const kenRef = useRef<Killable | null>(null);
    const introRef = useRef<Killable | null>(null);
    const timelineRef = useRef<TimelineLike | null>(null);
    const retryRef = useRef(0);
    const zoomDoneRef = useRef(false);
    const pausedRef = useRef(paused);
    const goToSlideRef = useRef<(index: number) => boolean>(() => false);
    const settledRef = useRef(onSettled);
    const slidesRef = useRef(slides);

    settledRef.current = onSettled;
    slidesRef.current = slides;
    pausedRef.current = paused;

    const advanceSlide = useCallback(() => {
      if (reduceMotion || pausedRef.current || slidesRef.current.length < 2) return;

      const next = (indexRef.current + 1) % slidesRef.current.length;
      const moved = goToSlideRef.current(next);

      if (!moved) {
        retryRef.current = window.setTimeout(advanceSlide, 320);
      }
    }, [reduceMotion]);

    const startBreath = useCallback(
      (index: number, gsap: GsapLike) => {
        const inner = innerRefs.current[index];
        if (!inner) return;

        killTween(kenRef.current);
        kenRef.current = null;
        window.clearTimeout(retryRef.current);

        const slide = slidesRef.current[index];
        const holdS = (slide?.primary ? hero.primaryIntervalMs : hero.slideIntervalMs) / 1000;

        zoomDoneRef.current = false;

        gsap.set(inner, {
          scale: 1,
          xPercent: 0,
          yPercent: 0,
          rotation: 0,
          transformOrigin: "50% 50%",
          force3D: true,
        });

        const hold = { t: 0 };
        kenRef.current = gsap.to(hold, {
          t: 1,
          duration: holdS,
          ease: "none",
          overwrite: "auto",
          onComplete: () => {
            if (gsapRef.current !== gsap || busyRef.current) return;
            zoomDoneRef.current = true;
            if (!pausedRef.current) advanceSlide();
          },
        }) as Killable;
      },
      [advanceSlide],
    );

    const goToSlide = useCallback(
      (nextIndex: number) => {
        const gsap = gsapRef.current;
        const slidesNow = slidesRef.current;
        const from = indexRef.current;

        if (!gsap || busyRef.current || reduceMotion) return false;
        if (nextIndex === from || nextIndex < 0 || nextIndex >= slidesNow.length) return false;

        const currentLayer = layerRefs.current[from];
        const nextLayer = layerRefs.current[nextIndex];
        const currentInner = innerRefs.current[from];
        const nextInner = innerRefs.current[nextIndex];
        if (!currentLayer || !nextLayer || !currentInner || !nextInner) return false;

        busyRef.current = true;
        killTween(introRef.current);
        introRef.current = null;
        killTween(kenRef.current);
        kenRef.current = null;
        killTween(timelineRef.current);
        timelineRef.current = null;

        const len = slidesNow.length;
        const stepsForward = (nextIndex - from + len) % len;
        const forward = stepsForward <= len / 2;
        const simple = isSimplifiedViewport();
        const diagonal = !simple && (from + nextIndex) % 2 === 0;
        const duration = simple ? MOBILE_MS : DESKTOP_MS;
        const ease = simple ? "power3.inOut" : "expo.inOut";

        nextLayer.style.willChange = "clip-path";

        gsap.set(nextLayer, {
          visibility: "visible",
          zIndex: 3,
          opacity: 1,
          clipPath: incomingClip(forward, diagonal, simple),
          force3D: true,
        });
        gsap.set(currentLayer, {
          visibility: "visible",
          zIndex: 2,
          opacity: 1,
          clipPath: openClip(simple),
          force3D: true,
        });
        gsap.set([currentInner, nextInner], {
          scale: 1,
          xPercent: 0,
          yPercent: 0,
          rotation: 0,
          transformOrigin: "50% 50%",
          force3D: true,
        });

        const tl = gsap.timeline({
          defaults: { ease, force3D: true },
          onComplete: () => {
            gsap.set(currentLayer, {
              visibility: "hidden",
              zIndex: 0,
              opacity: 1,
              clipPath: openClip(simple),
            });
            gsap.set(nextLayer, {
              visibility: "visible",
              zIndex: 2,
              opacity: 1,
              clipPath: openClip(simple),
            });
            gsap.set([currentInner, nextInner], {
              scale: 1,
              xPercent: 0,
              yPercent: 0,
              rotation: 0,
            });

            nextLayer.style.willChange = "";

            indexRef.current = nextIndex;
            timelineRef.current = null;
            busyRef.current = false;
            startBreath(nextIndex, gsap);
            settledRef.current?.(nextIndex);
          },
        }) as TimelineLike;

        timelineRef.current = tl;

        tl.to(
          nextLayer,
          {
            clipPath: openClip(simple),
            duration,
          },
          0,
        );

        return true;
      },
      [reduceMotion, startBreath],
    );

    goToSlideRef.current = goToSlide;

    useEffect(() => {
      pausedRef.current = paused;
      if (paused || reduceMotion || busyRef.current || !zoomDoneRef.current) return;
      retryRef.current = window.setTimeout(advanceSlide, 320);
      return () => window.clearTimeout(retryRef.current);
    }, [advanceSlide, paused, reduceMotion]);

    useImperativeHandle(ref, () => ({ goToSlide }), [goToSlide]);

    useGSAP(
      ({ gsap, addCleanup }) => {
        gsapRef.current = gsap;
        indexRef.current = 0;
        busyRef.current = false;

        layerRefs.current.forEach((layer, index) => {
          if (!layer) return;
          gsap.set(layer, {
            visibility: index === 0 ? "visible" : "hidden",
            zIndex: index === 0 ? 2 : 0,
            opacity: 1,
            clipPath: openClip(isSimplifiedViewport()),
            force3D: true,
          });
        });

        const firstInner = innerRefs.current[0];
        if (firstInner) {
          introRef.current = gsap.fromTo(
            firstInner,
            {
              opacity: 0,
              scale: 1,
              xPercent: 0,
              yPercent: 0,
              transformOrigin: "50% 50%",
            },
            {
              opacity: 1,
              scale: 1,
              duration: 1.35,
              ease: "power2.out",
              force3D: true,
              onComplete: () => {
                introRef.current = null;
                if (gsapRef.current === gsap && indexRef.current === 0 && !busyRef.current) {
                  settledRef.current?.(0);
                  startBreath(0, gsap);
                }
              },
            },
          ) as Killable;
        }

        addCleanup(() => {
          window.clearTimeout(retryRef.current);
          killTween(introRef.current);
          killTween(timelineRef.current);
          killTween(kenRef.current);
          introRef.current = null;
          timelineRef.current = null;
          kenRef.current = null;
          gsapRef.current = null;
          busyRef.current = false;
        });
      },
      { scope: rootRef, enabled: !reduceMotion && slides.length > 0, deps: [slides.length, startBreath] },
    );

    const visibleSlides = reduceMotion ? slides.slice(0, 1) : slides;

    return (
      <div ref={rootRef} className="hero-modern__media" aria-hidden>
        <div ref={stageRef} className="hero-modern__stage">
          {visibleSlides.map((slide, index) => (
            <div
              key={slide.alt}
              ref={(node) => {
                layerRefs.current[index] = node;
              }}
              className={`hero-modern__layer${index === 0 ? " is-seed" : ""}`}
            >
              <div
                ref={(node) => {
                  innerRefs.current[index] = node;
                }}
                className="hero-modern__layer-inner"
              >
                <Image
                  src={slide.src}
                  alt=""
                  fill
                  priority={index === 0}
                  fetchPriority={index === 0 ? "high" : "auto"}
                  quality={100}
                  unoptimized={slide.primary}
                  draggable={false}
                  className="hero-modern__img object-cover"
                  sizes="100vw"
                />
              </div>
            </div>
          ))}
        </div>
        <div className="hero-modern__scrim" />
      </div>
    );
  },
);
