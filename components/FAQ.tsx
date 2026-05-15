"use client";

import { RevealChildren } from "@/components/animations/RevealChildren";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { faqItems } from "@/lib/data";
import { AnimatePresence, motion, useReducedMotion } from "@/components/ClientMotion";
import { useId, useState } from "react";

export function FAQ() {
  const reduceMotion = useReducedMotion();
  const baseId = useId();

  return (
    <section id="faq" className="bg-bg-primary py-24 md:py-32">
      <RevealChildren
        className="mx-auto grid max-w-7xl gap-12 px-5 md:grid-cols-2 md:gap-16 md:px-10 lg:gap-24"
        stagger={0.1}
      >
        <ScrollReveal dramatic className="min-w-0">
          <p className="label-upper text-gold">Client Desk</p>
          <h2 className="mt-4 max-w-md font-display text-4xl italic leading-tight text-ink-primary md:text-[2.75rem]">
            Before We Start
          </h2>
          <p className="mt-6 text-sm leading-relaxed text-ink-secondary md:text-base">
            Clear answers on scope, timeline, and delivery so you can move forward with confidence.
          </p>
          <motion.a
            href="#contact"
            className="label-upper mt-10 inline-flex rounded-full border border-gold/45 bg-gold/15 px-8 py-3 text-ink-primary transition-colors hover:bg-gold/25"
            whileHover={reduceMotion ? {} : { scale: 1.02 }}
            whileTap={reduceMotion ? {} : { scale: 0.98 }}
            aria-label="Talk to strategy team via contact section"
          >
            Talk to Strategy Team
          </motion.a>
        </ScrollReveal>

        <ScrollReveal
          dramatic
          delay={0.06}
          role="region"
          aria-label="FAQ accordion"
          className="min-w-0"
        >
          <div className="divide-y divide-gold/15">
            {faqItems.map((item) => (
              <FaqRow key={item.id} item={item} panelId={`${baseId}-${item.id}`} reduceMotion={!!reduceMotion} />
            ))}
          </div>
        </ScrollReveal>
      </RevealChildren>
    </section>
  );
}

function FaqRow({
  item,
  panelId,
  reduceMotion,
}: {
  item: { id: string; question: string; answer: string };
  panelId: string;
  reduceMotion: boolean;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-gold/25">
      <button
        type="button"
        suppressHydrationWarning
        aria-expanded={open}
        aria-controls={panelId}
        id={`${panelId}-trigger`}
        className="flex w-full items-center justify-between gap-6 py-6 text-left"
        onClick={() => setOpen((v) => !v)}
      >
        <span className="font-display text-xl italic text-ink-primary md:text-2xl">{item.question}</span>
        <motion.span
          aria-hidden
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-gold/35 text-gold"
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: reduceMotion ? 0 : 0.25 }}
        >
          <span className="relative block h-4 w-4">
            <span className="absolute left-0 top-1/2 h-px w-4 -translate-y-1/2 bg-current" />
            <motion.span
              className="absolute left-1/2 top-0 h-4 w-px -translate-x-1/2 bg-current"
              animate={{ scaleY: open ? 0 : 1, opacity: open ? 0 : 1 }}
              transition={{ duration: reduceMotion ? 0 : 0.2 }}
            />
          </span>
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={panelId}
            role="region"
            aria-labelledby={`${panelId}-trigger`}
            initial={{ height: 0, opacity: reduceMotion ? 1 : 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: reduceMotion ? 1 : 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.38, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <p className="pb-6 text-sm leading-relaxed text-ink-secondary md:text-[15px]">{item.answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
