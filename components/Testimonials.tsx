"use client";

import { testimonials } from "@/lib/data";
import { motion, useReducedMotion } from "@/components/ClientMotion";
import Image from "next/image";
import { Quote, Star } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const viewport = { once: true, amount: 0.25 };

export function Testimonials() {
  const reduceMotion = useReducedMotion();
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    function update() {
      setIsMobile(mq.matches);
    }
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el || !isMobile || reduceMotion) return;

    const id = window.setInterval(() => {
      const maxScroll = el.scrollWidth - el.clientWidth;
      if (maxScroll <= 0) return;
      const atEnd = el.scrollLeft >= maxScroll - 8;
      if (atEnd) {
        el.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        el.scrollBy({ left: el.clientWidth * 0.85, behavior: "smooth" });
      }
    }, 5000);

    return () => window.clearInterval(id);
  }, [isMobile, reduceMotion]);

  return (
    <section className="relative bg-bg-primary py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-5 md:px-10">
        <motion.div
          className="mx-auto max-w-3xl text-center"
          initial={{ opacity: reduceMotion ? 1 : 0, y: reduceMotion ? 0 : 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewport}
          transition={{ duration: reduceMotion ? 0 : 0.55 }}
        >
          <p className="label-upper text-gold">Proof</p>
          <h2 className="section-title section-title--lead mt-4 text-gold">
            What Clients Achieve
          </h2>
          <p className="mt-6 text-sm leading-relaxed text-ink-secondary md:text-base">
            Performance-led partnerships with developers, operators, and investors across high-value sectors.
          </p>
        </motion.div>

        <div
          ref={scrollerRef}
          className="mt-14 flex snap-x snap-mandatory gap-6 overflow-x-auto pb-2 md:grid md:snap-none md:grid-cols-3 md:gap-8 md:overflow-visible"
          tabIndex={0}
          aria-label="Client success stories"
        >
          {testimonials.map((t, idx) => (
            <motion.article
              key={t.id}
              className="relative min-w-[min(420px,88vw)] snap-center overflow-hidden rounded-xl border border-gold/25 bg-bg-card/80 p-8 md:min-w-0"
              initial={{ opacity: reduceMotion ? 1 : 0, y: reduceMotion ? 0 : 26 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={viewport}
              transition={{
                delay: reduceMotion ? 0 : 0.07 * idx,
                duration: reduceMotion ? 0 : 0.45,
              }}
            >
              <Quote
                className="pointer-events-none absolute right-6 top-6 h-24 w-24 text-gold/[0.08]"
                aria-hidden
              />
              <div className="relative flex items-start gap-5">
                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full border border-gold/55">
                  <Image src={t.image} alt={t.imageAlt} fill className="object-cover" sizes="64px" />
                </div>
                <div>
                  <h3 className="font-display text-xl italic text-ink-primary">{t.name}</h3>
                  <p className="label-upper mt-1 text-ink-muted">{t.role}</p>
                </div>
              </div>
              <p className="relative mt-6 text-sm leading-relaxed text-ink-secondary md:text-[15px]">
                &ldquo;{t.quote}&rdquo;
              </p>
              <div className="relative mt-6 flex gap-1 text-gold" aria-label="Five out of five stars">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-gold text-gold" aria-hidden />
                ))}
              </div>
            </motion.article>
          ))}
        </div>

        <div className="mt-8 flex justify-center gap-2 md:hidden" aria-hidden>
          {testimonials.map((t) => (
            <span key={t.id} className="h-2 w-2 rounded-full bg-gold/25" />
          ))}
        </div>
      </div>
    </section>
  );
}
