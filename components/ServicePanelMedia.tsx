"use client";

import { motion, useReducedMotion } from "@/components/ClientMotion";
import type { ServiceVisualAsset, ServiceVisualSlide } from "@/lib/content/service-visuals";
import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

const IMAGE_QUALITY = 82;
const CROSSFADE_S = 1.65;
const SLIDE_INTERVAL_MS = 3800;

/**
 * Service panel cover — static portfolio frame, a muted project video on
 * hover, or a cinematic stills sequence (interior / exterior) like the hero.
 */
export function ServicePanelMedia({
  visual,
  isPlaying,
  sizes,
  priority = false,
  imageClassName = "services-panel-image object-cover",
}: {
  visual: ServiceVisualAsset;
  isPlaying: boolean;
  sizes: string;
  priority?: boolean;
  imageClassName?: string;
}) {
  const reduceMotion = useReducedMotion();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoReady, setVideoReady] = useState(false);
  const hasVideo = Boolean(visual.videoSrc) && !reduceMotion;
  const slides = useMemo<readonly ServiceVisualSlide[]>(
    () =>
      visual.slides?.length
        ? visual.slides
        : [{ src: visual.src, alt: visual.alt, objectPosition: visual.objectPosition }],
    [visual],
  );
  const canSlideshow = slides.length > 1 && !hasVideo && !reduceMotion;
  const [active, setActive] = useState(0);
  const [armed, setArmed] = useState(false);
  const [progressKey, setProgressKey] = useState(0);

  useEffect(() => {
    if (isPlaying) setArmed(true);
  }, [isPlaying]);

  useEffect(() => {
    if (!isPlaying || !canSlideshow) {
      setActive(0);
      return;
    }

    const id = window.setTimeout(() => {
      setActive((i) => (i + 1) % slides.length);
      setProgressKey((k) => k + 1);
    }, SLIDE_INTERVAL_MS);

    return () => window.clearTimeout(id);
  }, [isPlaying, canSlideshow, active, slides.length]);

  const seekToPoster = useCallback(() => {
    const el = videoRef.current;
    if (!el) return;
    const t = visual.videoStartAt ?? 0;
    if (Number.isFinite(el.duration) && el.duration > 0 && t >= el.duration) return;
    try {
      if (Math.abs(el.currentTime - t) > 0.04) el.currentTime = t;
    } catch {
      /* seek before metadata — ignore */
    }
  }, [visual.videoStartAt]);

  useEffect(() => {
    const el = videoRef.current;
    if (!el || !hasVideo) return;

    if (isPlaying) {
      void el.play().catch(() => {
        /* autoplay policy — poster frame stays visible */
      });
      return;
    }

    el.pause();
    seekToPoster();
  }, [isPlaying, hasVideo, seekToPoster]);

  const visibleSlides = canSlideshow && armed ? slides : slides.slice(0, 1);
  const showTicks = canSlideshow && isPlaying && visibleSlides.length > 1;

  return (
    <div
      className={`service-panel-media absolute inset-0 overflow-hidden${
        canSlideshow ? " service-panel-media--slideshow" : ""
      }`}
    >
      {hasVideo ? (
        <video
          ref={videoRef}
          className={`service-panel-media__video absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${
            videoReady ? "opacity-100" : "opacity-0"
          } ${isPlaying ? "service-panel-media__video--playing" : ""}`}
          style={{ objectPosition: visual.objectPosition }}
          src={visual.videoSrc}
          muted
          playsInline
          loop
          preload="metadata"
          aria-hidden
          onLoadedData={() => {
            seekToPoster();
            setVideoReady(true);
          }}
        />
      ) : null}

      {visibleSlides.map((slide, index) => {
        const isActive = reduceMotion || !canSlideshow ? index === 0 : index === active;

        return (
          <motion.div
            key={slide.alt}
            className="service-panel-media__slide"
            initial={false}
            animate={{ opacity: isActive ? 1 : 0 }}
            transition={
              reduceMotion || !canSlideshow
                ? { duration: 0 }
                : { opacity: { duration: CROSSFADE_S, ease: [0.22, 1, 0.36, 1] } }
            }
            style={{ zIndex: isActive ? 2 : 1 }}
            aria-hidden={!isActive}
          >
            <motion.div
              className="service-panel-media__ken"
              initial={false}
              animate={{
                scale:
                  reduceMotion || !canSlideshow
                    ? 1
                    : isPlaying && isActive
                      ? 1.08
                      : 1,
              }}
              transition={{
                duration:
                  isPlaying && isActive && canSlideshow && !reduceMotion
                    ? SLIDE_INTERVAL_MS / 1000
                    : 0.85,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              <Image
                src={slide.src}
                alt=""
                fill
                quality={IMAGE_QUALITY}
                sizes={sizes}
                priority={priority && index === 0}
                className={`${imageClassName} ${
                  hasVideo && videoReady ? "opacity-0" : "opacity-100"
                }`}
                style={{ objectPosition: slide.objectPosition }}
              />
            </motion.div>
          </motion.div>
        );
      })}

      {showTicks ? (
        <div className="service-panel-media__ticks" aria-hidden>
          {slides.map((slide, index) => {
            const isActive = index === active;
            return (
              <span
                key={slide.alt}
                className={`service-panel-media__tick ${isActive ? "is-active" : ""}`}
              >
                {isActive ? (
                  <motion.span
                    key={progressKey}
                    className="service-panel-media__tick-fill"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: SLIDE_INTERVAL_MS / 1000, ease: "linear" }}
                  />
                ) : null}
              </span>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
