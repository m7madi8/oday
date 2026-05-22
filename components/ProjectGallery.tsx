"use client";

import { ProjectImageLightbox } from "@/components/ProjectImageLightbox";
import { AnimatePresence, motion, useReducedMotion } from "@/components/ClientMotion";
import type { ProjectGalleryFormat, ProjectGalleryImage } from "@/lib/data";
import { gallerySpring, galleryTransition } from "@/lib/gallery-motion";
import { ChevronLeft, ChevronRight, Expand } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

function aspectClass(format: ProjectGalleryFormat) {
  return format === "instagram" ? "aspect-[4/5]" : "aspect-video";
}

function slideWidthClass(format: ProjectGalleryFormat) {
  return format === "instagram"
    ? "w-[min(72vw,280px)] sm:w-[300px]"
    : "w-[min(88vw,480px)] sm:w-[520px]";
}

function GallerySlide({
  image,
  index,
  format,
  active,
  onOpen,
  onFocus,
  reduce,
}: {
  image: ProjectGalleryImage;
  index: number;
  format: ProjectGalleryFormat;
  active: boolean;
  onOpen: (index: number) => void;
  onFocus: (index: number) => void;
  reduce: boolean;
}) {
  return (
    <motion.button
      type="button"
      data-no-glow
      data-slide-index={index}
      layout
      initial={reduce ? false : { opacity: 0, y: 24, scale: 0.94 }}
      animate={{
        opacity: active ? 1 : 0.88,
        y: 0,
        scale: active ? 1 : 0.98,
      }}
      transition={galleryTransition(reduce, 0.5, index * 0.06)}
      whileHover={reduce ? {} : { scale: active ? 1.02 : 1.01, y: -3 }}
      className={`project-gallery__tile group relative shrink-0 snap-center overflow-hidden rounded-2xl border bg-bg-card text-left ${slideWidthClass(format)} ${aspectClass(format)} ${
        active
          ? "border-gold/50 shadow-[0_20px_56px_rgba(0,0,0,0.45)] ring-1 ring-gold/25"
          : "border-white/[0.1] hover:border-gold/35 hover:opacity-100"
      }`}
      onClick={() => onOpen(index)}
      onFocus={() => onFocus(index)}
      aria-label={`View fullscreen: ${image.alt}`}
      aria-current={active ? "true" : undefined}
    >
      <Image
        src={image.src}
        alt={image.alt}
        fill
        className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
        sizes={format === "instagram" ? "300px" : "520px"}
        priority={index < 3}
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-t from-bg-primary/85 via-bg-primary/10 to-transparent"
      />
      <div className="absolute left-3 top-3 z-[2] rounded-full border border-white/15 bg-bg-primary/70 px-2.5 py-1 font-outfit text-[10px] font-medium tabular-nums tracking-[0.12em] text-ink-primary backdrop-blur-md">
        {String(index + 1).padStart(2, "0")}
      </div>
      <div className="absolute bottom-0 right-0 z-[2] p-3 sm:p-4">
        <span className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-bg-primary/70 text-ink-primary opacity-0 backdrop-blur-md transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100">
          <Expand className="h-3.5 w-3.5" aria-hidden />
        </span>
      </div>
    </motion.button>
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
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const open = useCallback((index: number) => setLightboxIndex(index), []);
  const close = useCallback(() => setLightboxIndex(null), []);
  const scrollToIndex = useCallback(
    (index: number) => {
      const track = trackRef.current;
      if (!track) return;
      const slide = track.querySelector<HTMLElement>(`[data-slide-index="${index}"]`);
      if (!slide) return;
      const left = slide.offsetLeft - (track.clientWidth - slide.offsetWidth) / 2;
      track.scrollTo({
        left: Math.max(0, left),
        behavior: reduce ? "auto" : "smooth",
      });
      setActiveIndex(index);
    },
    [reduce],
  );

  const go = useCallback(
    (delta: number) => {
      scrollToIndex((activeIndex + delta + images.length) % images.length);
    },
    [activeIndex, images.length, scrollToIndex],
  );

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const onScroll = () => {
      const center = track.scrollLeft + track.clientWidth / 2;
      let closest = 0;
      let minDist = Infinity;
      track.querySelectorAll<HTMLElement>("[data-slide-index]").forEach((el) => {
        const slideCenter = el.offsetLeft + el.offsetWidth / 2;
        const dist = Math.abs(slideCenter - center);
        const idx = Number(el.dataset.slideIndex);
        if (dist < minDist) {
          minDist = dist;
          closest = idx;
        }
      });
      setActiveIndex(closest);
    };

    track.addEventListener("scroll", onScroll, { passive: true });
    return () => track.removeEventListener("scroll", onScroll);
  }, [images.length]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (lightboxIndex !== null) return;
      if (e.key === "ArrowLeft") go(-1);
      if (e.key === "ArrowRight") go(1);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go, lightboxIndex]);

  return (
    <div className="project-gallery space-y-4">
      <div className="relative">
        <motion.span
          key={activeIndex}
          initial={reduce ? false : { opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={galleryTransition(!!reduce, 0.28)}
          className="absolute right-0 top-0 z-20 -translate-y-full pb-2 font-outfit text-[10px] tabular-nums tracking-[0.14em] text-ink-muted"
        >
          {String(activeIndex + 1).padStart(2, "0")} / {String(images.length).padStart(2, "0")}
        </motion.span>
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-gradient-to-r from-bg-primary to-transparent sm:w-16" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l from-bg-primary to-transparent sm:w-16" />

        <div
          ref={trackRef}
          className="project-gallery__track flex gap-4 overflow-x-auto overscroll-x-contain scroll-smooth px-1 py-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden snap-x snap-mandatory"
          role="region"
          aria-label={`${title} image carousel`}
          tabIndex={0}
        >
          {images.map((image, index) => (
            <GallerySlide
              key={`${image.alt}-${index}`}
              image={image}
              index={index}
              format={format}
              active={index === activeIndex}
              onOpen={open}
              onFocus={setActiveIndex}
              reduce={!!reduce}
            />
          ))}
        </div>

        {images.length > 1 ? (
          <>
            <motion.button
              type="button"
              data-no-glow
              onClick={() => go(-1)}
              initial={reduce ? false : { opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={galleryTransition(!!reduce, 0.45, 0.2)}
              whileTap={reduce ? {} : { scale: 0.94 }}
              className="absolute left-2 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-bg-primary/80 text-ink-primary backdrop-blur-md transition-colors hover:border-gold/40 sm:left-3"
              aria-label="Previous image in carousel"
            >
              <ChevronLeft className="h-5 w-5" aria-hidden />
            </motion.button>
            <motion.button
              type="button"
              data-no-glow
              onClick={() => go(1)}
              initial={reduce ? false : { opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={galleryTransition(!!reduce, 0.45, 0.2)}
              whileTap={reduce ? {} : { scale: 0.94 }}
              className="absolute right-2 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-bg-primary/80 text-ink-primary backdrop-blur-md transition-colors hover:border-gold/40 sm:right-3"
              aria-label="Next image in carousel"
            >
              <ChevronRight className="h-5 w-5" aria-hidden />
            </motion.button>
          </>
        ) : null}
      </div>

      <div
        className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:thin]"
        role="tablist"
        aria-label={`${title} carousel thumbnails`}
      >
        {images.map((img, i) => {
          const selected = i === activeIndex;
          return (
            <motion.button
              key={`thumb-${img.alt}-${i}`}
              type="button"
              role="tab"
              aria-selected={selected}
              aria-label={`Go to image ${i + 1}`}
              data-no-glow
              onClick={() => scrollToIndex(i)}
              layout
              animate={{
                scale: selected ? 1.06 : 1,
                opacity: selected ? 1 : 0.5,
              }}
              transition={reduce ? { duration: 0 } : gallerySpring.soft}
              className={`relative shrink-0 overflow-hidden rounded-lg border ${
                format === "instagram" ? "h-14 w-11" : "h-12 w-[4.5rem]"
              } ${
                selected
                  ? "border-gold/60 ring-1 ring-gold/35"
                  : "border-white/10 hover:border-gold/30 hover:opacity-90"
              }`}
            >
              <Image src={img.src} alt="" fill className="object-cover" sizes="64px" />
            </motion.button>
          );
        })}
      </div>

      <AnimatePresence>
        {lightboxIndex !== null ? (
          <ProjectImageLightbox
            images={images}
            index={lightboxIndex}
            title={title}
            onClose={close}
            onIndexChange={setLightboxIndex}
          />
        ) : null}
      </AnimatePresence>
    </div>
  );
}
