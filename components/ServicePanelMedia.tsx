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
  prefetch = false,
  sizes,
  priority = false,
  imageClassName = "services-panel-image object-cover",
}: {
  visual: ServiceVisualAsset;
  isPlaying: boolean;
  /** Warm the video buffer for adjacent carousel slides (AI / Drone). */
  prefetch?: boolean;
  sizes: string;
  priority?: boolean;
  imageClassName?: string;
}) {
  const reduceMotion = useReducedMotion();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoVisible, setVideoVisible] = useState(false);
  const hasVideo = Boolean(visual.videoSrc) && !reduceMotion;
  const shouldLoadVideo = hasVideo && (isPlaying || prefetch);
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
    if (!el || !shouldLoadVideo) {
      setVideoVisible(false);
      return;
    }

    let cancelled = false;

    const waitForCanPlay = () =>
      new Promise<void>((resolve) => {
        if (el.readyState >= HTMLMediaElement.HAVE_FUTURE_DATA) {
          resolve();
          return;
        }

        const onReady = () => {
          el.removeEventListener("canplay", onReady);
          resolve();
        };

        el.addEventListener("canplay", onReady);
        el.load();
      });

    const run = async () => {
      seekToPoster();

      if (!isPlaying) {
        setVideoVisible(false);
        el.pause();
        return;
      }

      try {
        await waitForCanPlay();
        if (cancelled) return;

        seekToPoster();
        await el.play();
        if (cancelled) return;

        setVideoVisible(true);
      } catch {
        if (!cancelled) setVideoVisible(false);
      }
    };

    void run();

    return () => {
      cancelled = true;
      el.pause();
      setVideoVisible(false);
    };
  }, [isPlaying, shouldLoadVideo, seekToPoster, visual.videoSrc]);

  const visibleSlides = canSlideshow && armed ? slides : slides.slice(0, 1);
  const showTicks = canSlideshow && isPlaying && visibleSlides.length > 1;
  const showPoster = !videoVisible;

  return (
    <div
      className={`service-panel-media absolute inset-0 overflow-hidden${
        canSlideshow ? " service-panel-media--slideshow" : ""
      }${hasVideo ? " service-panel-media--video" : ""}`}
    >
      {shouldLoadVideo ? (
        <video
          ref={videoRef}
          className={`service-panel-media__video absolute inset-0 h-full w-full object-cover ${
            videoVisible ? "service-panel-media__video--visible" : ""
          } ${isPlaying ? "service-panel-media__video--playing" : ""}`}
          style={{ objectPosition: visual.objectPosition }}
          src={visual.videoSrc}
          poster={visual.src.src}
          muted
          playsInline
          loop
          preload={isPlaying ? "auto" : "metadata"}
          aria-hidden
          onLoadedData={seekToPoster}
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
                className={`${imageClassName} service-panel-media__poster ${
                  showPoster ? "service-panel-media__poster--visible" : ""
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
