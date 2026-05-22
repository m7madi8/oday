"use client";

import { AnimatePresence, motion, useReducedMotion } from "@/components/ClientMotion";
import type { ProjectGalleryImage } from "@/lib/data";
import { galleryEase, galleryTransition } from "@/lib/gallery-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect } from "react";

export function ProjectImageLightbox({
  images,
  index,
  title,
  onClose,
  onIndexChange,
}: {
  images: ProjectGalleryImage[];
  index: number;
  title: string;
  onClose: () => void;
  onIndexChange: (next: number) => void;
}) {
  const reduce = useReducedMotion();
  const total = images.length;
  const current = images[index];

  const go = useCallback(
    (delta: number) => {
      onIndexChange((index + delta + total) % total);
    },
    [index, total, onIndexChange],
  );

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") go(-1);
      if (e.key === "ArrowRight") go(1);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, go]);

  return (
    <AnimatePresence>
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-label={`${title} — image ${index + 1} of ${total}`}
        className="project-lightbox fixed inset-0 z-[620] flex items-center justify-center"
        initial={{ opacity: 0, backdropFilter: reduce ? "none" : "blur(0px)" }}
        animate={{ opacity: 1, backdropFilter: "blur(0px)" }}
        exit={{ opacity: 0 }}
        transition={galleryTransition(!!reduce, 0.38)}
      >
        <button
          type="button"
          aria-label="Close"
          className="project-lightbox__backdrop absolute inset-0 z-0"
          onClick={onClose}
        />

        {total > 1 ? (
          <>
            <button
              type="button"
              data-no-glow
              onClick={() => go(-1)}
              className="project-lightbox__nav project-lightbox__nav--prev absolute top-1/2 z-[2] flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-black/50 text-white/90 backdrop-blur-md transition-colors hover:border-gold/40 sm:h-12 sm:w-12"
              aria-label="Previous image"
            >
              <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" aria-hidden />
            </button>
            <button
              type="button"
              data-no-glow
              onClick={() => go(1)}
              className="project-lightbox__nav project-lightbox__nav--next absolute top-1/2 z-[2] flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-black/50 text-white/90 backdrop-blur-md transition-colors hover:border-gold/40 sm:h-12 sm:w-12"
              aria-label="Next image"
            >
              <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6" aria-hidden />
            </button>
          </>
        ) : null}

        <motion.div
          className="project-lightbox__window relative z-[1] flex h-[90vh] w-[90vw] flex-col overflow-hidden"
          initial={{ opacity: reduce ? 1 : 0, scale: reduce ? 1 : 0.9, y: reduce ? 0 : 24, filter: reduce ? "none" : "blur(12px)" }}
          animate={{ opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }}
          exit={{ opacity: reduce ? 1 : 0, scale: reduce ? 1 : 0.96, y: reduce ? 0 : 12, filter: reduce ? "none" : "blur(8px)" }}
          transition={galleryTransition(!!reduce, 0.48, 0, galleryEase.prestige)}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="relative min-h-0 flex-1">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={index}
                className="absolute inset-0"
                initial={{ opacity: reduce ? 1 : 0, scale: reduce ? 1 : 1.03 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: reduce ? 1 : 0, scale: reduce ? 1 : 0.98 }}
                transition={galleryTransition(!!reduce, 0.35)}
              >
                <Image
                  src={current.src}
                  alt={current.alt}
                  fill
                  className="object-cover"
                  sizes="90vw"
                  priority
                />
              </motion.div>
            </AnimatePresence>
            <div aria-hidden className="project-lightbox__vignette pointer-events-none absolute inset-0" />
          </div>

          <div className="pointer-events-none absolute left-4 top-4 z-10">
            <span className="rounded-full border border-white/12 bg-black/45 px-3.5 py-1.5 font-outfit text-[11px] font-medium tabular-nums tracking-[0.14em] text-white/75 backdrop-blur-md">
              {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
            </span>
          </div>

          <button
            type="button"
            data-no-glow
            onClick={onClose}
            className="project-lightbox__close absolute right-3 top-3 z-10 flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-black/50 text-white/90 backdrop-blur-md transition-colors hover:border-gold/45 hover:bg-black/60 hover:text-gold sm:right-4 sm:top-4"
            aria-label="Close"
          >
            <X className="h-5 w-5" aria-hidden />
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
