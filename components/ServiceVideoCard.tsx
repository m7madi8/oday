"use client";

import type { ServiceGalleryVideo } from "@/lib/content/service-gallery";
import { Pause, Play, Volume2, VolumeX } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export function ServiceVideoCard({
  video,
  badge,
  featured = false,
}: {
  video: ServiceGalleryVideo;
  badge: string;
  featured?: boolean;
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

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          void el.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
        } else {
          el.pause();
          setPlaying(false);
        }
      },
      { threshold: 0.45, rootMargin: "0px 0px -8% 0px" },
    );

    observer.observe(root);
    return () => observer.disconnect();
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
    <article
      ref={rootRef}
      className={`svc-video-card${featured ? " svc-video-card--featured" : ""}`}
      data-ready={ready ? "true" : "false"}
    >
      <div className="svc-video-card__frame">
        <div className="svc-video-card__stage">
          <video
            ref={videoRef}
            className="svc-video-card__media"
            src={video.src}
            muted={muted}
            playsInline
            loop
            preload="metadata"
            onLoadedData={() => setReady(true)}
          />

          <div className="svc-video-card__shade" aria-hidden />

          <div className="svc-video-card__top">
            <span className="svc-video-card__order">{video.orderLabel}</span>
            <span className="svc-video-card__badge">{badge}</span>
          </div>

          <div className="svc-video-card__controls">
            <button
              type="button"
              data-no-glow
              className="svc-video-card__btn"
              onClick={togglePlay}
              aria-label={playing ? "Pause video" : "Play video"}
            >
              {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </button>
            <button
              type="button"
              data-no-glow
              className="svc-video-card__btn"
              onClick={toggleMute}
              aria-label={muted ? "Unmute video" : "Mute video"}
            >
              {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            </button>
          </div>

          <div className="svc-video-card__copy">
            <p className="svc-video-card__client">{video.client}</p>
            <h3 className="svc-video-card__title">{video.title}</h3>
            <p className="svc-video-card__desc">{video.description}</p>
          </div>
        </div>
      </div>
    </article>
  );
}
