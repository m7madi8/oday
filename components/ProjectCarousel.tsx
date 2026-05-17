"use client";

import { AnimatePresence, motion, useReducedMotion } from "@/components/ClientMotion";
import type { ProjectGalleryImage } from "@/lib/data";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";

export function ProjectCarousel({
  images,
  title,
}: {
  images: ProjectGalleryImage[];
  title: string;
}) {
  const reduce = useReducedMotion();
  const [index, setIndex] = useState(0);
  const total = images.length;

  const go = useCallback(
    (delta: number) => {
      setIndex((i) => (i + delta + total) % total);
    },
    [total],
  );

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "ArrowLeft") go(-1);
      if (e.key === "ArrowRight") go(1);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go]);

  const current = images[index];

  return (
    <div className="space-y-4">
      <div className="relative overflow-hidden rounded-2xl border border-gold/25 bg-bg-card shadow-[0_24px_64px_rgba(0,0,0,0.45)]">
        <div className="relative aspect-[16/10] min-h-[240px] w-full sm:min-h-[320px] md:min-h-[420px]">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={index}
              className="absolute inset-0"
              initial={{ opacity: reduce ? 1 : 0, scale: reduce ? 1 : 1.03 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: reduce ? 1 : 0, scale: reduce ? 1 : 0.98 }}
              transition={{ duration: reduce ? 0 : 0.45, ease: [0.22, 1, 0.36, 1] }}
            >
              <Image
                src={current.src}
                alt={current.alt}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1200px"
                priority={index === 0}
              />
            </motion.div>
          </AnimatePresence>

          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-gradient-to-t from-bg-primary/75 via-transparent to-bg-primary/20"
          />

          <div className="absolute left-4 top-4 z-10 rounded-full border border-white/15 bg-bg-primary/70 px-3 py-1.5 font-outfit text-[11px] font-medium tabular-nums tracking-[0.12em] text-ink-primary backdrop-blur-md">
            {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
          </div>

          <button
            type="button"
            onClick={() => go(-1)}
            className="absolute left-3 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-bg-primary/75 text-ink-primary backdrop-blur-md transition-colors hover:border-gold/40 hover:bg-bg-primary/90"
            aria-label={`Previous image for ${title}`}
          >
            <ChevronLeft className="h-5 w-5" aria-hidden />
          </button>
          <button
            type="button"
            onClick={() => go(1)}
            className="absolute right-3 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-bg-primary/75 text-ink-primary backdrop-blur-md transition-colors hover:border-gold/40 hover:bg-bg-primary/90"
            aria-label={`Next image for ${title}`}
          >
            <ChevronRight className="h-5 w-5" aria-hidden />
          </button>
        </div>
      </div>

      <div
        className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:thin]"
        role="tablist"
        aria-label={`${title} gallery thumbnails`}
      >
        {images.map((img, i) => {
          const active = i === index;
          return (
            <button
              key={img.alt}
              type="button"
              role="tab"
              aria-selected={active}
              aria-label={`Show image ${i + 1}`}
              onClick={() => setIndex(i)}
              className={`relative h-16 w-24 shrink-0 overflow-hidden rounded-lg border transition-[border-color,opacity,transform] duration-200 sm:h-[4.5rem] sm:w-28 ${
                active
                  ? "border-gold/60 opacity-100 ring-1 ring-gold/35"
                  : "border-white/10 opacity-55 hover:border-gold/30 hover:opacity-90"
              }`}
            >
              <Image src={img.src} alt="" fill className="object-cover" sizes="112px" />
            </button>
          );
        })}
      </div>
    </div>
  );
}
