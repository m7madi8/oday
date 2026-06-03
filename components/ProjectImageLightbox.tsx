"use client";

import { AnimatePresence, motion, useReducedMotion } from "@/components/ClientMotion";
import type { ProjectGalleryImage } from "@/lib/data";
import { galleryEase, galleryTransition } from "@/lib/gallery-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useRef } from "react";
import { createPortal } from "react-dom";

const SWIPE_THRESHOLD = 48;

export function ProjectImageLightbox({
  open,
  images,
  index,
  title,
  onClose,
  onIndexChange,
}: {
  open: boolean;
  images: ProjectGalleryImage[];
  index: number;
  title: string;
  onClose: () => void;
  onIndexChange: (next: number) => void;
}) {
  const reduce = useReducedMotion();
  const touchStartX = useRef<number | null>(null);
  const total = images.length;
  const current = images[index];

  const go = useCallback(
    (delta: number) => {
      if (total < 2) return;
      onIndexChange((index + delta + total) % total);
    },
    [index, total, onIndexChange],
  );

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
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") go(-1);
      if (e.key === "ArrowRight") go(1);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose, go]);

  const onTouchStart = (clientX: number) => {
    touchStartX.current = clientX;
  };

  const onTouchEnd = (clientX: number) => {
    if (touchStartX.current === null || total < 2) return;
    const delta = touchStartX.current - clientX;
    touchStartX.current = null;
    if (Math.abs(delta) < SWIPE_THRESHOLD) return;
    if (delta > 0) go(1);
    else go(-1);
  };

  if (typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {open && current ? (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label={`${title} — image ${index + 1} of ${total}`}
          className="project-lightbox"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={galleryTransition(!!reduce, 0.32)}
        >
          <button
            type="button"
            aria-label="Close"
            className="project-lightbox__backdrop"
            onClick={onClose}
          />

          {total > 1 ? (
            <>
              <button
                type="button"
                data-no-glow
                onClick={() => go(-1)}
                className="project-lightbox__nav project-lightbox__nav--prev"
                aria-label="Previous image"
              >
                <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" aria-hidden />
              </button>
              <button
                type="button"
                data-no-glow
                onClick={() => go(1)}
                className="project-lightbox__nav project-lightbox__nav--next"
                aria-label="Next image"
              >
                <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6" aria-hidden />
              </button>
            </>
          ) : null}

          <motion.div
            className="project-lightbox__window"
            initial={{
              opacity: reduce ? 1 : 0,
              scale: reduce ? 1 : 0.97,
            }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: reduce ? 1 : 0, scale: reduce ? 1 : 0.98 }}
            transition={galleryTransition(!!reduce, 0.4, 0, galleryEase.prestige)}
            onClick={(e) => e.stopPropagation()}
            onTouchStart={(e) => {
              const touch = e.touches[0];
              if (touch) onTouchStart(touch.clientX);
            }}
            onTouchEnd={(e) => {
              const touch = e.changedTouches[0];
              if (touch) onTouchEnd(touch.clientX);
            }}
          >
            <div className="project-lightbox__media">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={index}
                  className="project-lightbox__slide"
                  initial={{ opacity: reduce ? 1 : 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: reduce ? 1 : 0 }}
                  transition={galleryTransition(!!reduce, 0.28)}
                >
                  <Image
                    src={current.src}
                    alt={current.alt}
                    fill
                    className="project-lightbox__img"
                    sizes="100vw"
                    priority
                    draggable={false}
                  />
                </motion.div>
              </AnimatePresence>
              <div aria-hidden className="project-lightbox__vignette" />
            </div>

            <div className="project-lightbox__meta">
              <p className="project-lightbox__caption">{current.alt}</p>
              <span className="project-lightbox__counter">
                {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
              </span>
            </div>

            <button
              type="button"
              data-no-glow
              onClick={onClose}
              className="project-lightbox__close"
              aria-label="Close"
            >
              <X className="h-5 w-5" aria-hidden />
            </button>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>,
    document.body,
  );
}
