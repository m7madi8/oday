"use client";

import type { ServiceGalleryVideo } from "@/lib/content/service-gallery";
import { Pause, Play, Volume2, VolumeX } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export function DroneVideoFilm({
  video,
  badge,
}: {
  video: ServiceGalleryVideo;
  badge: string;
}) {
  const rootRef = useRef<HTMLElement | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const root = rootRef.current;
    const el = videoRef.current;
    if (!root || !el) return;

    const syncPlayback = (shouldPlay: boolean) => {
      if (shouldPlay) {
        void el.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
        return;
      }
      el.pause();
      setPlaying(false);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        syncPlayback(Boolean(entry?.isIntersecting && entry.intersectionRatio > 0.05));
      },
      { threshold: [0, 0.15, 0.35], rootMargin: "0px" },
    );

    observer.observe(root);

    const checkInitial = () => {
      const rect = root.getBoundingClientRect();
      const inView =
        rect.width > 0 &&
        rect.height > 0 &&
        rect.top < window.innerHeight &&
        rect.bottom > 0;
      if (inView) syncPlayback(true);
    };

    checkInitial();
    const raf = requestAnimationFrame(checkInitial);
    const onResize = () => checkInitial();
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      observer.disconnect();
    };
  }, []);

  const togglePlay = () => {
    const el = videoRef.current;
    if (!el) return;
    if (el.paused) {
      void el.play().then(() => setPlaying(true));
    } else {
      el.pause();
      setPlaying(false);
    }
  };

  const toggleMute = () => {
    const el = videoRef.current;
    if (!el) return;
    el.muted = !el.muted;
    setMuted(el.muted);
  };

  return (
    <article ref={rootRef} className="drone-film" data-ready={ready ? "true" : "false"}>
      <div className="drone-film__frame">
        <div className="drone-film__stage">
          <video
            ref={videoRef}
            className="drone-film__video"
            src={video.src}
            muted={muted}
            playsInline
            loop
            preload="auto"
            onLoadedData={(e) => {
              const el = e.currentTarget;
              if (el.videoWidth > 0 && el.videoHeight > 0) {
                el.style.aspectRatio = `${el.videoWidth} / ${el.videoHeight}`;
              }
              setReady(true);
            }}
            onLoadedMetadata={(e) => {
              const el = e.currentTarget;
              if (el.videoWidth > 0 && el.videoHeight > 0) {
                el.style.aspectRatio = `${el.videoWidth} / ${el.videoHeight}`;
              }
              setReady(true);
            }}
          />

          <div className="drone-film__shade" aria-hidden />

          <div className="drone-film__top">
            <span className="drone-film__order">{video.orderLabel}</span>
            <span className="drone-film__badge">{badge}</span>
          </div>

          <div className="drone-film__controls">
            <button
              type="button"
              data-no-glow
              className="drone-film__btn"
              onClick={togglePlay}
              aria-label={playing ? "Pause video" : "Play video"}
            >
              {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </button>
            <button
              type="button"
              data-no-glow
              className="drone-film__btn"
              onClick={toggleMute}
              aria-label={muted ? "Unmute video" : "Mute video"}
            >
              {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
