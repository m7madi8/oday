"use client";

import { RevealChildren } from "@/components/animations/RevealChildren";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { faqItems } from "@/lib/content/faq";
import { AnimatePresence, motion, useReducedMotion } from "@/components/ClientMotion";
import { useId, useState } from "react";
import { SectionHeader, SectionInner, SectionShell } from "@/components/SectionShell";

export function FAQ() {
  const reduceMotion = useReducedMotion();
  const baseId = useId();

  return (
    <SectionShell id="faq">
      <SectionInner>
      <RevealChildren
        className="grid w-full gap-8 md:grid-cols-2 md:gap-10 lg:gap-14"
        stagger={0.1}
      >
        <ScrollReveal dramatic className="min-w-0">
          <SectionHeader
            align="start"
            eyebrow="Client Desk"
            title="Before We Start"
            description="Clear answers on scope, timeline, and delivery so you can move forward with confidence."
          />
          <motion.a
            href="#contact"
            className="label-upper mt-6 inline-flex rounded-full border border-gold/45 bg-gold/15 px-6 py-2.5 text-ink-primary transition-colors hover:bg-gold/25"
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
          <div>
            {faqItems.map((item, index) => (
              <div key={item.id} className={index > 0 ? "border-t border-white/10" : undefined}>
                <FaqRow item={item} panelId={`${baseId}-${item.id}`} reduceMotion={!!reduceMotion} />
              </div>
            ))}
          </div>
        </ScrollReveal>
      </RevealChildren>
      </SectionInner>
    </SectionShell>
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
    <div>
      <button
        type="button"
        data-no-glow
        suppressHydrationWarning
        aria-expanded={open}
        aria-controls={panelId}
        id={`${panelId}-trigger`}
        className="btn-plain flex w-full items-center justify-between gap-4 border-0 py-4 text-left shadow-none md:py-5"
        onClick={() => setOpen((v) => !v)}
      >
        <span className="font-display text-lg italic text-ink-primary md:text-xl">{item.question}</span>
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
