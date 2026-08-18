"use client";

import { ProjectImageLightbox } from "@/components/ProjectImageLightbox";
import { useReducedMotion } from "@/components/ClientMotion";
import {
  getGalleryCardSize,
  resolveGalleryImageDimensions,
} from "@/lib/project-gallery-layout";
import { type ProjectGalleryFormat, type ProjectGalleryImage } from "@/lib/data";
import { galleryTransition } from "@/lib/gallery-motion";
import { motion } from "@/components/ClientMotion";
import { ChevronLeft, ChevronRight, Maximize2 } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

const MAX_CARD_H = 480;
const MAX_CARD_W = 720;
const MAX_CARD_H_MOBILE = 360;
const MAX_CARD_W_MOBILE = 320;

const VISIBLE_WINDOW = 2;

function GalleryCard({
  image,
  index,
  isActive,
  format,
  maxHeight,
  maxWidth,
  mountImage,
  onOpen,
  onNavigate,
}: {
  image: ProjectGalleryImage;
  index: number;
  isActive: boolean;
  format: ProjectGalleryFormat;
  maxHeight: number;
  maxWidth: number;
  mountImage: boolean;
  onOpen: () => void;
  onNavigate: () => void;
}) {
  const dims = resolveGalleryImageDimensions(image.src, format);
  const { width, height } = getGalleryCardSize(dims, { maxHeight, maxWidth });
  const label = String(index + 1).padStart(2, "0");

  return (
    <article
      data-gallery-card={index}
      role="tab"
      tabIndex={0}
      aria-selected={isActive}
      aria-label={
        isActive
          ? `${label} — ${image.alt}. Tap to view fullscreen`
          : `${label} — ${image.alt}. Tap to view`
      }
      onClick={() => {
        if (isActive) {
          onOpen();
        } else {
          onNavigate();
        }
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          if (isActive) onOpen();
          else onNavigate();
        }
      }}
      className={`project-gallery__card${isActive ? " project-gallery__card--active" : ""}`}
      style={{ width, height }}
    >
      {mountImage ? (
        <Image
          src={image.src}
          alt={image.alt}
          width={width}
          height={height}
          className="project-gallery__img"
          sizes={`(max-width: 640px) ${maxWidth}px, ${maxWidth}px`}
          priority={index < 2}
          loading={index < 2 ? "eager" : "lazy"}
          draggable={false}
        />
      ) : (
        <div className="project-gallery__img" aria-hidden />
      )}
      <span className="project-gallery__badge" aria-hidden>
        {label}
      </span>
      <span className="project-gallery__expand" aria-hidden>
        <Maximize2 className="h-3.5 w-3.5" strokeWidth={1.75} />
      </span>
    </article>
  );
}

export function ProjectGallery({
  images,
  title,
  format,
}: {
  images: ProjectGalleryImage[];
  title: string;
  format: ProjectGalleryFormat;
}) {
  const reduce = useReducedMotion();
  const trackRef = useRef<HTMLDivElement>(null);
  const skipObserverRef = useRef(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [maxHeight, setMaxHeight] = useState(MAX_CARD_H);
  const [maxWidth, setMaxWidth] = useState(MAX_CARD_W);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 640px)");
    const apply = () => {
      setMaxHeight(mq.matches ? MAX_CARD_H_MOBILE : MAX_CARD_H);
      setMaxWidth(mq.matches ? MAX_CARD_W_MOBILE : MAX_CARD_W);
    };
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  const scrollToCard = useCallback(
    (index: number) => {
      const track = trackRef.current;
      if (!track) return;
      const card = track.querySelector<HTMLElement>(`[data-gallery-card="${index}"]`);
      if (!card) return;
      const target = card.offsetLeft - (track.clientWidth - card.offsetWidth) / 2;
      track.scrollTo({
        left: Math.max(0, Math.min(target, track.scrollWidth - track.clientWidth)),
        behavior: reduce ? "auto" : "smooth",
      });
    },
    [reduce],
  );

  const releaseObserverLock = useCallback(() => {
    skipObserverRef.current = false;
  }, []);

  const navigateTo = useCallback(
    (index: number) => {
      skipObserverRef.current = true;
      setActiveIndex(index);
      scrollToCard(index);
    },
    [scrollToCard],
  );

  useEffect(() => {
    const track = trackRef.current;
    if (!track || images.length < 2) return;

    let settleTimer: ReturnType<typeof setTimeout> | undefined;

    const scheduleObserverRelease = () => {
      if (!skipObserverRef.current) return;
      clearTimeout(settleTimer);
      settleTimer = setTimeout(releaseObserverLock, reduce ? 80 : 480);
    };

    const onScrollEnd = () => {
      if (skipObserverRef.current) releaseObserverLock();
    };

    track.addEventListener("scroll", scheduleObserverRelease, { passive: true });
    track.addEventListener("scrollend", onScrollEnd);

    const cards = track.querySelectorAll<HTMLElement>("[data-gallery-card]");
    const observer = new IntersectionObserver(
      (entries) => {
        if (skipObserverRef.current) return;
        let best: { index: number; ratio: number } | null = null;
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const index = Number((entry.target as HTMLElement).dataset.galleryCard);
          if (Number.isNaN(index)) continue;
          const ratio = entry.intersectionRatio;
          if (!best || ratio > best.ratio) {
            best = { index, ratio };
          }
        }
        if (best) setActiveIndex(best.index);
      },
      { root: track, threshold: [0.4, 0.55, 0.7, 0.85] },
    );

    cards.forEach((card) => observer.observe(card));
    return () => {
      clearTimeout(settleTimer);
      track.removeEventListener("scroll", scheduleObserverRelease);
      track.removeEventListener("scrollend", onScrollEnd);
      observer.disconnect();
    };
  }, [images.length, maxHeight, maxWidth, reduce, releaseObserverLock]);

  const select = useCallback(
    (index: number) => {
      navigateTo(index);
    },
    [navigateTo],
  );

  const openLightbox = useCallback(
    (index: number) => {
      skipObserverRef.current = true;
      setActiveIndex(index);
      setLightboxIndex(index);
      setLightboxOpen(true);
      scrollToCard(index);
    },
    [scrollToCard],
  );

  useEffect(() => {
    if (lightboxOpen) return;
    function onKey(e: KeyboardEvent) {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        select((activeIndex - 1 + images.length) % images.length);
      }
      if (e.key === "ArrowRight") {
        e.preventDefault();
        select((activeIndex + 1) % images.length);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [activeIndex, images.length, lightboxOpen, select]);

  const goPrev = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      e.stopPropagation();
      if (images.length < 2) return;
      navigateTo((activeIndex - 1 + images.length) % images.length);
    },
    [activeIndex, images.length, navigateTo],
  );

  const goNext = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      e.stopPropagation();
      if (images.length < 2) return;
      navigateTo((activeIndex + 1) % images.length);
    },
    [activeIndex, images.length, navigateTo],
  );

  if (!images.length) return null;

  const focusProgress = images.length > 1 ? activeIndex / (images.length - 1) : 1;
  const canNavigate = images.length > 1;

  return (
    <section className="project-gallery" aria-label={`${title} gallery`}>
      <div className="project-gallery__header">
        <div>
          <p className="label-upper text-gold/90">Project frames</p>
          <p className="mt-1 font-outfit text-[11px] text-ink-muted">
            <span className="md:hidden">Swipe to browse · tap active frame for fullscreen</span>
            <span className="hidden md:inline">
              Use side arrows or keyboard · tap active frame for fullscreen
            </span>
          </p>
        </div>
        <motion.p
          key={activeIndex}
          initial={reduce ? false : { opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={galleryTransition(!!reduce, 0.35)}
          className="project-gallery__counter font-outfit tabular-nums"
          aria-live="polite"
        >
          {String(activeIndex + 1).padStart(2, "0")}
          <span className="text-ink-muted"> / {String(images.length).padStart(2, "0")}</span>
          <span className="sr-only"> — {images[activeIndex]?.alt}</span>
        </motion.p>
      </div>

      <div
        className={`project-gallery__stage${canNavigate ? " project-gallery__stage--has-nav" : ""}`}
      >
        {canNavigate ? (
          <button
            type="button"
            data-no-glow
            className="project-gallery__nav-btn project-gallery__nav-btn--prev"
            aria-label="Previous image"
            onClick={goPrev}
          >
            <ChevronLeft className="h-5 w-5" strokeWidth={1.5} aria-hidden />
          </button>
        ) : null}

        <div
          ref={trackRef}
          className="project-gallery__track"
          role="tablist"
          aria-label={`${title} image gallery`}
        >
          {images.map((image, index) => (
            <GalleryCard
              key={`${image.alt}-${index}`}
              image={image}
              index={index}
              isActive={index === activeIndex}
              format={format}
              maxHeight={maxHeight}
              maxWidth={maxWidth}
              mountImage={index < 2 || Math.abs(index - activeIndex) <= VISIBLE_WINDOW}
              onNavigate={() => navigateTo(index)}
              onOpen={() => openLightbox(index)}
            />
          ))}
        </div>

        {canNavigate ? (
          <button
            type="button"
            data-no-glow
            className="project-gallery__nav-btn project-gallery__nav-btn--next"
            aria-label="Next image"
            onClick={goNext}
          >
            <ChevronRight className="h-5 w-5" strokeWidth={1.5} aria-hidden />
          </button>
        ) : null}
      </div>

      <ProjectImageLightbox
        open={lightboxOpen}
        images={images}
        index={lightboxIndex}
        title={title}
        onClose={() => setLightboxOpen(false)}
        onIndexChange={(next) => {
          setLightboxIndex(next);
          setActiveIndex(next);
          scrollToCard(next);
        }}
      />

      <div
        className="project-gallery__progress"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(focusProgress * 100)}
        aria-label="Gallery position"
      >
        <motion.div
          className="project-gallery__progress-fill"
          animate={{ width: `${focusProgress * 100}%` }}
          transition={reduce ? { duration: 0 } : { duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>
    </section>
  );
}
