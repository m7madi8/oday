"use client";

import { RevealChildren } from "@/components/animations/RevealChildren";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { processSteps } from "@/lib/data";
import { revealInView, softInView } from "@/lib/motion-viewport";
import { motion, useReducedMotion } from "@/components/ClientMotion";
const executionPillars = ["Strategy", "Engineering", "Delivery"] as const;

export function Process() {
  const reduceMotion = useReducedMotion();

  return (
    <section
      id="process"
      className="relative bg-bg-primary py-24 md:py-32"
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/45 to-transparent" />
      <div className="pointer-events-none absolute left-[6%] top-24 hidden h-32 w-32 border border-gold/12 lg:block" />
      <div className="pointer-events-none absolute bottom-20 right-[7%] hidden h-24 w-56 skew-x-[-20deg] border border-gold/12 lg:block" />

      <RevealChildren className="mx-auto max-w-7xl px-5 md:px-10" stagger={0.08}>
        <ScrollReveal
          className="relative mx-auto max-w-4xl overflow-hidden rounded-[1.75rem] border border-gold/22 bg-bg-card/45 px-6 py-10 text-center shadow-[0_24px_70px_rgba(0,0,0,0.42)] backdrop-blur-md md:rounded-[2rem] md:px-11 md:py-12"
        >
          <div
            aria-hidden
            className="pointer-events-none absolute -left-1/3 top-1/2 h-[140%] w-[55%] -translate-y-1/2 rounded-full bg-gold/[0.07] blur-3xl"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_75%_55%_at_50%_-5%,rgba(245, 197, 24,0.14),transparent_58%)]"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-gold/35 to-transparent"
          />

          <div className="relative z-10">
            <p className="label-upper text-gold tracking-[0.26em]">Execution Model</p>
            <div className="mx-auto mt-5 flex justify-center">
              <div className="h-px w-[4.5rem] bg-gradient-to-r from-transparent via-gold/60 to-transparent md:w-24" />
            </div>

            <h2 className="section-title section-title--lead mx-auto mt-6 max-w-[18ch] not-italic md:max-w-[22ch]">
              <span className="block italic text-ink-primary">From Brief to</span>
              <span className="mt-1.5 block bg-gradient-to-r from-[#fff9d6] via-[#f5c518] to-[#fff9d6] bg-clip-text italic text-transparent md:mt-2">
                Market Impact
              </span>
            </h2>

            <p className="mx-auto mt-7 max-w-2xl text-pretty text-sm leading-[1.75] text-ink-secondary md:mt-8 md:text-[0.95rem]">
              A premium, stage-gated framework that aligns project goals, design quality, and construction control from day one.
            </p>

            <div className="mt-9 flex flex-wrap items-center justify-center gap-2.5 md:mt-10 md:gap-3">
              {executionPillars.map((item, i) => (
                <motion.span
                  key={item}
                  className="label-upper rounded-full border border-gold/32 bg-[rgba(22,22,22,0.65)] px-4 py-2 text-[0.62rem] text-ink-secondary shadow-[0_6px_24px_rgba(0,0,0,0.28)] backdrop-blur-sm transition-[border-color,color,transform,box-shadow] duration-300 hover:border-gold/50 hover:text-ink-primary md:px-5 md:py-2.5 md:text-[0.65rem]"
                  initial={{ opacity: reduceMotion ? 1 : 0, y: reduceMotion ? 0 : 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={revealInView}
                  transition={{
                    delay: reduceMotion ? 0 : 0.06 * i,
                    duration: reduceMotion ? 0 : 0.45,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  whileHover={reduceMotion ? undefined : { y: -2 }}
                >
                  {item}
                </motion.span>
              ))}
            </div>
          </div>
        </ScrollReveal>

        <div className="relative mt-16 hidden overflow-hidden rounded-2xl border border-gold/25 bg-bg-card/85 p-8 shadow-[0_24px_60px_rgba(0,0,0,0.4)] md:block lg:p-10">
          <motion.div
            aria-hidden
            className="absolute left-10 right-10 top-[72px] h-px origin-left bg-gradient-to-r from-gold/20 via-gold/55 to-gold/20"
            initial={{ scaleX: reduceMotion ? 1 : 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={softInView}
            transition={{ duration: reduceMotion ? 0 : 0.95, ease: [0.22, 1, 0.36, 1] }}
          />

          <div className="grid grid-cols-4 gap-5 lg:gap-6">
            {processSteps.map((step, idx) => (
              <motion.article
                key={step.step}
                className="relative rounded-xl border border-gold/20 bg-bg-primary/80 p-5"
                initial={{ opacity: reduceMotion ? 1 : 0, y: reduceMotion ? 0 : 36 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={revealInView}
                transition={{
                  delay: reduceMotion ? 0 : 0.09 * idx,
                  duration: reduceMotion ? 0 : 0.58,
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                <span
                  aria-hidden
                  className="absolute -top-[30px] left-5 h-3.5 w-3.5 rounded-full border border-gold/80 bg-bg-card"
                />
                <p className="label-upper text-gold">{step.step}</p>
                <h3 className="mt-3 font-display text-2xl italic text-ink-primary">{step.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-ink-secondary">{step.description}</p>
                <span className="mt-5 block h-px bg-gradient-to-r from-gold/35 to-transparent" aria-hidden />
              </motion.article>
            ))}
          </div>
        </div>

        <div className="mt-12 space-y-4 md:hidden">
          {processSteps.map((step, idx) => (
            <motion.article
              key={step.step}
              className="rounded-xl border border-gold/25 bg-bg-card/90 p-5 shadow-[0_14px_30px_rgba(0,0,0,0.32)]"
              initial={{ opacity: reduceMotion ? 1 : 0, x: reduceMotion ? 0 : -28 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={revealInView}
              transition={{
                delay: reduceMotion ? 0 : 0.07 * idx,
                duration: reduceMotion ? 0 : 0.52,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-gold/45 bg-bg-primary">
                  <span className="font-display text-base italic text-gold">{step.step}</span>
                </div>
                <div>
                  <h3 className="font-display text-xl italic text-ink-primary">{step.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-secondary">{step.description}</p>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </RevealChildren>
    </section>
  );
}
