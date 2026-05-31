"use client";

import { motion, useReducedMotion } from "@/components/ClientMotion";
import {
  projectGalleryFrame,
  type ProjectGalleryFormat,
  type ProjectGalleryImage,
} from "@/lib/data";
import { gallerySpring, galleryTransition } from "@/lib/gallery-motion";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

/** Lower = slower, smoother mouse-driven scroll */
const PAN_LERP = 0.012;

function GalleryCard({
  image,
  index,
  isActive,
  onSelect,
  reduce,
}: {
  image: ProjectGalleryImage;
  index: number;
  isActive: boolean;
  onSelect: () => void;
  reduce: boolean;
}) {
  const label = String(index + 1).padStart(2, "0");

  return (
    <motion.article
      data-gallery-card={index}
      layout={false}
      role="tab"
      tabIndex={0}
      aria-selected={isActive}
      aria-label={`${label} — ${image.alt}`}
      onClick={onSelect}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect();
        }
      }}
      animate={
        reduce
          ? undefined
          : {
              scale: isActive ? 1 : 0.99,
              opacity: isActive ? 1 : 0.88,
            }
      }
      transition={reduce ? { duration: 0 } : gallerySpring.soft}
      className={`project-gallery__card shrink-0 cursor-pointer ${
        isActive ? "project-gallery__card--active" : ""
      }`}
    >
      <div className="project-gallery__card-media">
        <Image
          src={image.src}
          alt={image.alt}
          fill
          className="object-contain object-center"
          sizes="(max-width: 768px) 88vw, 720px"
          priority={index < 3}
          draggable={false}
        />
      </div>

      <span className="project-gallery__badge" aria-hidden>
        {label}
      </span>

      {isActive ? (
        <motion.div
          aria-hidden
          className="project-gallery__card-caption"
          initial={false}
          animate={{ opacity: 1, y: 0 }}
          transition={reduce ? { duration: 0 } : { duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="line-clamp-2 font-outfit text-[11px] leading-snug text-white/90 sm:text-xs">
            {image.alt}
          </p>
        </motion.div>
      ) : null}
    </motion.article>
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
  const zoneRef = useRef<HTMLDivElement>(null);
  const panRafRef = useRef(0);
  const panActiveRef = useRef(false);
  const scrollTargetRef = useRef(0);
  const scrollCurrentRef = useRef(0);
  const finePointerRef = useRef(false);

  const [activeIndex, setActiveIndex] = useState(0);
  void format;

  const syncScrollRefs = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    scrollCurrentRef.current = track.scrollLeft;
    scrollTargetRef.current = track.scrollLeft;
  }, []);

  const scrollToCard = useCallback(
    (index: number) => {
      const track = trackRef.current;
      if (!track) return;
      const card = track.querySelector<HTMLElement>(`[data-gallery-card="${index}"]`);
      if (!card) return;
      const target = card.offsetLeft - (track.clientWidth - card.offsetWidth) / 2;
      const clamped = Math.max(0, Math.min(target, track.scrollWidth - track.clientWidth));

      scrollTargetRef.current = clamped;
      scrollCurrentRef.current = clamped;
      track.scrollTo({
        left: clamped,
        behavior: reduce ? "auto" : "smooth",
      });
    },
    [reduce],
  );

  const select = useCallback(
    (index: number) => {
      setActiveIndex(index);
      scrollToCard(index);
    },
    [scrollToCard],
  );

  const go = useCallback(
    (delta: number) => {
      select((activeIndex + delta + images.length) % images.length);
    },
    [activeIndex, images.length, select],
  );

  const runPanLoop = useCallback(() => {
    if (panActiveRef.current) return;
    panActiveRef.current = true;

    const tick = () => {
      const track = trackRef.current;
      if (!track) {
        panActiveRef.current = false;
        return;
      }

      const target = scrollTargetRef.current;
      const current = scrollCurrentRef.current;
      const diff = target - current;

      if (Math.abs(diff) < 0.35) {
        scrollCurrentRef.current = target;
        track.scrollLeft = target;
        panActiveRef.current = false;
        return;
      }

      const next = current + diff * PAN_LERP;
      scrollCurrentRef.current = next;
      track.scrollLeft = next;
      panRafRef.current = requestAnimationFrame(tick);
    };

    panRafRef.current = requestAnimationFrame(tick);
  }, []);

  const panToRatio = useCallback(
    (ratio: number) => {
      const track = trackRef.current;
      if (!track) return;
      const max = track.scrollWidth - track.clientWidth;
      if (max <= 0) return;

      scrollTargetRef.current = Math.max(0, Math.min(1, ratio)) * max;
      runPanLoop();
    },
    [runPanLoop],
  );

  useEffect(() => {
    finePointerRef.current = window.matchMedia("(pointer: fine)").matches;
    const mq = window.matchMedia("(pointer: fine)");
    const onChange = () => {
      finePointerRef.current = mq.matches;
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    syncScrollRefs();

    const onScroll = () => {
      if (panActiveRef.current) return;
      syncScrollRefs();
    };

    track.addEventListener("scroll", onScroll, { passive: true });
    return () => track.removeEventListener("scroll", onScroll);
  }, [syncScrollRefs, images.length]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        go(-1);
      }
      if (e.key === "ArrowRight") {
        e.preventDefault();
        go(1);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go]);

  useEffect(() => {
    return () => cancelAnimationFrame(panRafRef.current);
  }, []);

  if (!images.length) return null;

  const focusProgress = images.length > 1 ? activeIndex / (images.length - 1) : 1;

  return (
    <section
      className="project-gallery"
      aria-label={`${title} gallery`}
      data-gallery-format="instagram-poster"
    >
      <div className="project-gallery__header">
        <div>
          <p className="label-upper text-gold/90">Project frames</p>
          <p className="mt-1 font-outfit text-[11px] text-ink-muted">
            <span className="hidden sm:inline">Frame · {projectGalleryFrame.label} · </span>
            Move the cursor to browse · tap to focus
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
        ref={zoneRef}
        className="project-gallery__stage"
        onMouseMove={(e) => {
          if (!finePointerRef.current || reduce) return;
          const zone = zoneRef.current;
          if (!zone) return;
          const rect = zone.getBoundingClientRect();
          if (rect.width <= 0) return;
          const ratio = (e.clientX - rect.left) / rect.width;
          panToRatio(ratio);
        }}
        onMouseLeave={() => {
          cancelAnimationFrame(panRafRef.current);
          panActiveRef.current = false;
        }}
      >
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
              onSelect={() => select(index)}
              reduce={!!reduce}
            />
          ))}
        </div>
      </div>

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
          transition={reduce ? { duration: 0 } : gallerySpring.soft}
        />
      </div>
    </section>
  );
}
