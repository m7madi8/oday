"use client";

import { AnimatePresence, motion, useReducedMotion } from "@/components/ClientMotion";
import { useFocusTrap } from "@/hooks/useFocusTrap";
import { galleryEase, galleryTransition } from "@/lib/gallery-motion";
import { Maximize2, Pause, Play, Volume2, VolumeX, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import "@/app/cinematic-film.css";

export function FilmTransport({
  playing,
  muted,
  expanded,
  onTogglePlay,
  onToggleMute,
  onExpand,
  onClose,
}: {
  playing: boolean;
  muted: boolean;
  expanded?: boolean;
  onTogglePlay: () => void;
  onToggleMute: () => void;
  onExpand?: () => void;
  onClose?: () => void;
}) {
  return (
    <div className={`film-controls${expanded ? " film-cinema__controls" : ""}`}>
      <button
        type="button"
        data-no-glow
        className="film-btn"
        onClick={(event) => {
          event.stopPropagation();
          onTogglePlay();
        }}
        aria-label={playing ? "Pause video" : "Play video"}
      >
        {playing ? <Pause className="h-4 w-4" strokeWidth={1.6} /> : <Play className="h-4 w-4" strokeWidth={1.6} />}
      </button>
      <button
        type="button"
        data-no-glow
        className="film-btn"
        onClick={(event) => {
          event.stopPropagation();
          onToggleMute();
        }}
        aria-label={muted ? "Unmute video" : "Mute video"}
      >
        {muted ? <VolumeX className="h-4 w-4" strokeWidth={1.6} /> : <Volume2 className="h-4 w-4" strokeWidth={1.6} />}
      </button>
      {onExpand ? (
        <button
          type="button"
          data-no-glow
          className="film-btn"
          onClick={(event) => {
            event.stopPropagation();
            onExpand();
          }}
          aria-label="Enlarge video"
        >
          <Maximize2 className="h-4 w-4" strokeWidth={1.6} />
        </button>
      ) : null}
      {onClose ? (
        <button
          type="button"
          data-no-glow
          className="film-btn film-cinema__close"
          onClick={(event) => {
            event.stopPropagation();
            onClose();
          }}
          aria-label="Close enlarged video"
        >
          <X className="h-4 w-4" strokeWidth={1.6} />
        </button>
      ) : null}
    </div>
  );
}

export function FilmPlayMark() {
  return (
    <span className="film-play-mark" aria-hidden>
      <span className="film-play-mark__ring">
        <Play className="h-5 w-5" strokeWidth={1.5} />
      </span>
    </span>
  );
}

export function CinematicFilmOverlay({
  open,
  src,
  title,
  client,
  startTime,
  muted,
  onClose,
  onSync,
}: {
  open: boolean;
  src: string;
  title: string;
  client: string;
  startTime: number;
  muted: boolean;
  onClose: () => void;
  onSync: (state: { currentTime: number; playing: boolean; muted: boolean }) => void;
}) {
  const reduce = useReducedMotion();
  const dialogRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const primedRef = useRef(false);
  const [playing, setPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(muted);

  useFocusTrap(dialogRef, open);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    setIsMuted(muted);
    setPlaying(true);
    primedRef.current = false;
  }, [muted, open]);

  const syncBack = useCallback(() => {
    const el = videoRef.current;
    onSync({
      currentTime: el?.currentTime ?? startTime,
      playing: Boolean(el && !el.paused),
      muted: el?.muted ?? isMuted,
    });
  }, [isMuted, onSync, startTime]);

  const close = useCallback(() => {
    syncBack();
    onClose();
  }, [onClose, syncBack]);

  useEffect(() => {
    if (!open) return;
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        close();
      }
      if (event.key === " ") {
        event.preventDefault();
        const el = videoRef.current;
        if (!el) return;
        if (el.paused) {
          void el.play().then(() => setPlaying(true));
        } else {
          el.pause();
          setPlaying(false);
        }
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [close, open]);

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
    setIsMuted(el.muted);
  };

  if (typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {open ? (
        <motion.div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-label={`${title} — enlarged film`}
          className="film-cinema"
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={galleryTransition(!!reduce, 0.38)}
        >
          <button
            type="button"
            className="film-cinema__scrim"
            aria-label="Close enlarged video"
            onClick={close}
          />
          <motion.div
            className="film-cinema__window"
            initial={reduce ? false : { opacity: 0, scale: 0.96, y: 18 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: 10 }}
            transition={
              reduce
                ? { duration: 0 }
                : { duration: 0.48, ease: galleryEase.prestige }
            }
          >
            <div className="film-cinema__stage" data-playing={playing ? "true" : "false"}>
              <video
                ref={videoRef}
                className="film-cinema__video"
                src={src}
                muted={isMuted}
                playsInline
                loop
                onLoadedMetadata={(event) => {
                  const el = event.currentTarget;
                  if (!primedRef.current) {
                    el.currentTime = startTime;
                    primedRef.current = true;
                  }
                  el.muted = isMuted;
                  void el.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
                }}
              />
              <button
                type="button"
                className="film-hit"
                onClick={togglePlay}
                aria-label={playing ? "Pause video" : "Play video"}
              />
              <FilmPlayMark />
              <div className="film-cinema__top">
                <div className="film-cinema__meta">
                  <p className="film-cinema__client">{client}</p>
                  <h3 className="film-cinema__title">{title}</h3>
                </div>
                <button
                  type="button"
                  data-no-glow
                  className="film-btn film-cinema__close"
                  onClick={close}
                  aria-label="Close enlarged video"
                >
                  <X className="h-4 w-4" strokeWidth={1.6} />
                </button>
              </div>
              <FilmTransport
                playing={playing}
                muted={isMuted}
                expanded
                onTogglePlay={togglePlay}
                onToggleMute={toggleMute}
              />
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>,
    document.body,
  );
}
