"use client";

import { CounterNumber } from "@/components/animations/CounterNumber";
import { GsapStaggerReveal } from "@/components/animations/GsapStaggerReveal";
import { RevealChildren } from "@/components/animations/RevealChildren";
import { RevealText } from "@/components/animations/RevealText";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { motion, useReducedMotion } from "@/components/ClientMotion";
import { revealInView } from "@/lib/motion-viewport";
import Image from "next/image";
import { useRef } from "react";
import aboutSectionImage from "@/imgs/about.jpg";

const stats = [
  { target: 180, suffix: "+", label: "Projects" },
  { target: 8, suffix: "", label: "Years" },
  { target: 91, suffix: "%", label: "Repeat clients" },
] as const;

const pillars = [
  "Design Strategy",
  "Technical Authority",
  "Execution Control",
] as const;

export function About() {
  const reduce = useReducedMotion();
  const statsRowRef = useRef<HTMLDivElement>(null);

  return (
    <section
      id="about"
      className="relative overflow-hidden bg-bg-primary py-20 md:py-24"
    >
      <RevealChildren
        className="relative mx-auto grid w-full max-w-7xl gap-8 px-5 md:grid-cols-[minmax(0,1.08fr)_minmax(0,0.92fr)] md:px-10 lg:gap-10"
        stagger={0.09}
      >
        <ScrollReveal
          as="article"
          dramatic
          className="flex flex-col justify-between rounded-xl border border-white/[0.08] bg-bg-card/90 p-7 md:p-9 lg:p-10"
        >
          <div>
            <header className="border-b border-white/[0.1] pb-5 md:pb-6">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={revealInView}
                transition={{ duration: reduce ? 0 : 0.45, ease: [0.16, 1, 0.3, 1] }}
              >
                <p className="label-upper tracking-[0.22em] text-gold/85">Company snapshot</p>
                <p className="mt-2 font-outfit text-[0.6875rem] font-normal tracking-[0.08em] text-ink-muted">
                  Key figures and operating focus
                </p>
              </motion.div>
            </header>

            <motion.div
              ref={statsRowRef}
              className="mt-7 border-y border-white/[0.08] md:mt-8"
              initial={reduce ? false : { opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.35, margin: "0px 0px -8% 0px" }}
              transition={{ duration: reduce ? 0 : 0.55, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="grid grid-cols-1 divide-y divide-white/[0.08] sm:grid-cols-3 sm:divide-x sm:divide-y-0">
                {stats.map((stat, idx) => (
                  <motion.div
                    key={stat.label}
                    className="py-5 text-left sm:px-5 sm:py-6 md:px-6 md:py-6 sm:first:pl-0"
                    initial={reduce ? false : { opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.25 }}
                    transition={{
                      duration: reduce ? 0 : 0.45,
                      delay: reduce ? 0 : 0.04 + idx * 0.05,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                  >
                    <p className="font-display text-[2rem] font-normal not-italic leading-none tabular-nums tracking-tight text-ink-primary md:text-[2.35rem]">
                      <CounterNumber
                        targetNumber={stat.target}
                        suffix={stat.suffix}
                        triggerRef={statsRowRef}
                        delay={reduce ? 0 : 0.18 + idx * 0.12}
                        duration={reduce ? 0 : 2}
                        ease="expo.out"
                        start="top 85%"
                        enabled={!reduce}
                      />
                    </p>
                    <p className="label-upper mt-2.5 tracking-[0.16em] text-ink-muted">{stat.label}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.p
              className="mt-8 max-w-xl text-[0.9375rem] leading-[1.65] text-ink-secondary md:mt-9 md:text-base md:leading-[1.7]"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={revealInView}
              transition={{ duration: reduce ? 0 : 0.55, delay: reduce ? 0 : 0.04, ease: [0.22, 1, 0.36, 1] }}
            >
              Architecture, interiors, and engineering — one accountable team.
            </motion.p>

            <h2 className="mt-6 font-display text-[clamp(1.85rem,4.2vw,3.25rem)] font-normal italic leading-[1.06] text-ink-primary md:mt-7">
              <RevealText as="span" className="block" splitByWords wordStagger={0.06} duration={0.85}>
                Built for Serious
              </RevealText>{" "}
              <RevealText as="span" className="text-gold/90" splitByWords wordStagger={0.07} duration={0.85} delay={0.12}>
                Developers
              </RevealText>
            </h2>

            <div className="mt-5 h-px w-full max-w-[4.5rem] bg-gold/35" aria-hidden />

            <GsapStaggerReveal
              className="mt-7 border-l border-gold/35 pl-5 md:mt-8 md:pl-6"
              start="top 88%"
              stagger={0.08}
            >
              {pillars.map((title) => (
                <div
                  key={title}
                  data-reveal-item
                  className="border-b border-white/[0.06] py-3 font-outfit text-[13px] font-medium tracking-[0.06em] text-ink-primary last:border-b-0 last:pb-0 first:pt-0"
                >
                  {title}
                </div>
              ))}
            </GsapStaggerReveal>
          </div>

          <motion.div
            className="mt-10 border-t border-white/[0.1] pt-6 md:mt-12 md:pt-7"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={revealInView}
            transition={{ duration: reduce ? 0 : 0.58, delay: reduce ? 0 : 0.06 }}
          >
            <p className="font-display text-[1.9rem] italic leading-none text-ink-primary md:text-[2.2rem]">
              Oday Abu Doha
            </p>
            <p
              className="label-upper mt-2 text-ink-muted"
              style={{ fontVariantCaps: "all-small-caps" }}
            >
              Founder &amp; Design Director
            </p>
          </motion.div>
        </ScrollReveal>

        <ScrollReveal dramatic delay={0.06} className="relative min-h-[340px] overflow-hidden rounded-2xl border border-gold/25 md:min-h-[460px] md:self-stretch">
          <Image
            src={aboutSectionImage}
            alt="OD Studio premium architectural project"
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 44vw"
            priority
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(18,18,18,0.72)_0%,rgba(18,18,18,0.28)_42%,rgba(18,18,18,0)_68%)]"
          />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#1e1913]/28 to-transparent" />

          <p className="absolute bottom-6 right-6 border-l-2 border-gold bg-bg-primary/72 px-3 py-2 text-[0.6rem] uppercase tracking-[0.18em] text-ink-primary backdrop-blur-[1px]">
            OD Studio - Premium Real Estate
          </p>
        </ScrollReveal>
      </RevealChildren>
    </section>
  );
}
