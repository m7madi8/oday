"use client";

import {
  CinematicFilmOverlay,
  FilmPlayMark,
  FilmTransport,
} from "@/components/CinematicFilmOverlay";
import type { ServiceGalleryVideo } from "@/lib/content/service-gallery";
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
  const cinemaOpenRef = useRef(false);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);
  const [ready, setReady] = useState(false);
  const [cinema, setCinema] = useState(false);

  useEffect(() => {
    cinemaOpenRef.current = cinema;
  }, [cinema]);

  useEffect(() => {
    const root = rootRef.current;
    const el = videoRef.current;
    if (!root || !el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (cinemaOpenRef.current) return;
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

  const openCinema = () => {
    const el = videoRef.current;
    if (el && !el.paused) {
      el.pause();
      setPlaying(false);
    }
    setCinema(true);
  };

  return (
    <article
      ref={rootRef}
      className={`svc-video-card${featured ? " svc-video-card--featured" : ""}`}
      data-ready={ready ? "true" : "false"}
    >
      <div className="svc-video-card__frame">
        <div
          className="svc-video-card__stage"
          data-playing={playing ? "true" : "false"}
        >
          <video
            ref={videoRef}
            className="svc-video-card__media"
            src={video.src}
            muted={muted}
            playsInline
            loop
            preload="metadata"
            onLoadedMetadata={(e) => {
              const el = e.currentTarget;
              if (el.videoWidth > 0 && el.videoHeight > 0) {
                el.style.aspectRatio = `${el.videoWidth} / ${el.videoHeight}`;
              }
              setReady(true);
            }}
          />

          <div className="svc-video-card__shade" aria-hidden />

          <div className="svc-video-card__top">
            <span className="svc-video-card__order">{video.orderLabel}</span>
            <span className="svc-video-card__badge">{badge}</span>
          </div>

          <button
            type="button"
            className="film-hit"
            onClick={togglePlay}
            aria-label={playing ? "Pause video" : "Play video"}
          />
          <FilmPlayMark />

          <div className="svc-video-card__copy svc-video-card__copy--overlay">
            <p className="svc-video-card__client">{video.client}</p>
            <h3 className="svc-video-card__title">{video.title}</h3>
            <p className="svc-video-card__desc">{video.description}</p>
          </div>

          <FilmTransport
            playing={playing}
            muted={muted}
            onTogglePlay={togglePlay}
            onToggleMute={toggleMute}
            onExpand={openCinema}
          />
        </div>
      </div>

      <div className="svc-video-card__meta">
        <div className="svc-video-card__meta-head">
          <p className="svc-video-card__client">{video.client}</p>
          <span className="svc-video-card__badge svc-video-card__badge--meta">{badge}</span>
        </div>
        <h3 className="svc-video-card__title">{video.title}</h3>
        <p className="svc-video-card__desc">{video.description}</p>
      </div>

      <CinematicFilmOverlay
        open={cinema}
        src={video.src}
        title={video.title}
        client={video.client}
        startTime={videoRef.current?.currentTime ?? 0}
        muted={muted}
        onClose={() => setCinema(false)}
        onSync={({ currentTime, playing: nextPlaying, muted: nextMuted }) => {
          const el = videoRef.current;
          if (!el) return;
          el.currentTime = currentTime;
          el.muted = nextMuted;
          setMuted(nextMuted);
          if (nextPlaying) {
            void el.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
          } else {
            el.pause();
            setPlaying(false);
          }
        }}
      />
    </article>
  );
}
