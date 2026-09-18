"use client";

import {
  CinematicFilmOverlay,
  FilmPlayMark,
  FilmTransport,
} from "@/components/CinematicFilmOverlay";
import type { ServiceGalleryVideo } from "@/lib/content/service-gallery";
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

    const syncPlayback = (shouldPlay: boolean) => {
      if (cinemaOpenRef.current) return;
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
      if (cinemaOpenRef.current) return;
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

  const openCinema = () => {
    const el = videoRef.current;
    if (el && !el.paused) {
      el.pause();
      setPlaying(false);
    }
    setCinema(true);
  };

  const applyAspect = (el: HTMLVideoElement) => {
    if (el.videoWidth > 0 && el.videoHeight > 0) {
      el.style.aspectRatio = `${el.videoWidth} / ${el.videoHeight}`;
    }
    setReady(true);
  };

  return (
    <article ref={rootRef} className="drone-film" data-ready={ready ? "true" : "false"}>
      <div className="drone-film__frame">
        <div className="drone-film__stage" data-playing={playing ? "true" : "false"}>
          <video
            ref={videoRef}
            className="drone-film__video"
            src={video.src}
            muted={muted}
            playsInline
            loop
            preload="auto"
            onLoadedData={(e) => applyAspect(e.currentTarget)}
            onLoadedMetadata={(e) => applyAspect(e.currentTarget)}
          />

          <div className="drone-film__shade" aria-hidden />

          <div className="drone-film__top">
            <span className="drone-film__order">{video.orderLabel}</span>
            <span className="drone-film__badge">{badge}</span>
          </div>

          <button
            type="button"
            className="film-hit"
            onClick={togglePlay}
            aria-label={playing ? "Pause video" : "Play video"}
          />
          <FilmPlayMark />

          <FilmTransport
            playing={playing}
            muted={muted}
            onTogglePlay={togglePlay}
            onToggleMute={toggleMute}
            onExpand={openCinema}
          />
        </div>
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
