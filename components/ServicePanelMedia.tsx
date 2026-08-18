"use client";

import { useReducedMotion } from "@/components/ClientMotion";
import type { ServiceVisualAsset } from "@/lib/content/service-visuals";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

const IMAGE_QUALITY = 82;

/**
 * Service panel cover — static portfolio frame, or a paused real project video
 * frame that plays muted on hover / active panel.
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

  return (
    <div className="service-panel-media absolute inset-0 overflow-hidden">
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

      <Image
        src={visual.src}
        alt={visual.alt}
        fill
        quality={IMAGE_QUALITY}
        sizes={sizes}
        priority={priority}
        className={`${imageClassName} transition-opacity duration-500 ${
          hasVideo && videoReady ? "opacity-0" : "opacity-100"
        }`}
        style={{ objectPosition: visual.objectPosition }}
      />
    </div>
  );
}
