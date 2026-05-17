"use client";

import { CounterNumber } from "@/components/animations/CounterNumber";
import { RevealChildren } from "@/components/animations/RevealChildren";
import { RevealText } from "@/components/animations/RevealText";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { motion, useReducedMotion } from "@/components/ClientMotion";
import { revealInView } from "@/lib/motion-viewport";
import { about as studioAbout } from "@/lib/data";
import Image from "next/image";
import { useRef } from "react";

const stats = [
  { target: 180, suffix: "+", label: "Projects" },
  { target: 8, suffix: "", label: "Years" },
  { target: 91, suffix: "%", label: "Repeat clients" },
] as const;

export function About() {
  const reduce = useReducedMotion();
  const statsRowRef = useRef<HTMLDivElement>(null);

  return (
    <section
      id="about"
      className="relative overflow-hidden bg-bg-primary py-10 md:py-12 lg:flex lg:min-h-[calc(100svh-var(--hero-nav-stack)-1.5rem)] lg:items-center lg:py-14"
    >
      <RevealChildren
        className="relative mx-auto grid w-full max-w-6xl items-center gap-6 px-5 md:gap-7 md:px-8 lg:grid-cols-[minmax(0,1.12fr)_minmax(220px,0.88fr)] lg:gap-8"
        stagger={0.07}
      >
        <ScrollReveal
          as="article"
          dramatic
          className="flex flex-col rounded-xl border border-white/[0.08] bg-bg-card/90 p-5 md:p-6 lg:p-7"
        >
          <header className="border-b border-white/[0.1] pb-3 md:pb-3.5">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={revealInView}
              transition={{ duration: reduce ? 0 : 0.45, ease: [0.16, 1, 0.3, 1] }}
            >
              <p className="label-upper tracking-[0.2em] text-gold/85">{studioAbout.snapshotEyebrow}</p>
              <p className="mt-1 font-outfit text-[0.6875rem] tracking-[0.06em] text-ink-muted">
                {studioAbout.snapshotSub}
              </p>
            </motion.div>
          </header>

          <motion.div
            ref={statsRowRef}
            className="mt-4 border-y border-white/[0.08] md:mt-4"
            initial={reduce ? false : { opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.35, margin: "0px 0px -8% 0px" }}
            transition={{ duration: reduce ? 0 : 0.55, ease: [0.22, 1, 0.36, 1] }}
          >
            <motion.div className="grid grid-cols-3 divide-x divide-white/[0.08]">
              {stats.map((stat, idx) => (
                <motion.div
                  key={stat.label}
                  className="py-3 text-center first:pl-0 sm:py-3.5"
                  initial={reduce ? false : { opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.25 }}
                  transition={{
                    duration: reduce ? 0 : 0.45,
                    delay: reduce ? 0 : 0.04 + idx * 0.05,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                >
                  <p className="font-display text-[1.65rem] font-normal not-italic leading-none tabular-nums tracking-tight text-ink-primary md:text-[1.85rem]">
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
                  <p className="label-upper mt-1.5 text-[0.6rem] tracking-[0.14em] text-ink-muted">{stat.label}</p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          <motion.p
            className="mt-4 max-w-2xl text-[0.875rem] font-medium leading-[1.58] text-ink-secondary md:mt-4 md:text-[0.9rem] md:leading-[1.62]"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={revealInView}
            transition={{ duration: reduce ? 0 : 0.55, delay: reduce ? 0 : 0.04, ease: [0.22, 1, 0.36, 1] }}
          >
            {studioAbout.introParagraph}
          </motion.p>

          <h2 className="mt-4 font-display text-[clamp(1.5rem,3.2vw,2.35rem)] font-normal italic leading-[1.08] text-ink-primary">
            <RevealText as="span" className="block" splitByWords wordStagger={0.06} duration={0.85}>
              {studioAbout.headlinePrimary}
            </RevealText>{" "}
            <RevealText as="span" className="text-gold/90" splitByWords wordStagger={0.07} duration={0.85} delay={0.12}>
              {studioAbout.headlineAccent}
            </RevealText>
          </h2>

          <div className="mt-3 h-px w-full max-w-[3.5rem] bg-gold/35" aria-hidden />

          <motion.ul
            className="mt-4 grid gap-3 sm:grid-cols-3 sm:gap-4 md:mt-4"
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={revealInView}
            transition={{ duration: reduce ? 0 : 0.5, delay: reduce ? 0 : 0.08 }}
          >
            {studioAbout.strengths.map(({ title, description, icon: Icon }) => (
              <li key={title} className="flex gap-2.5 sm:flex-col sm:gap-2">
                <motion.div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-gold/28 bg-bg-primary/80 text-gold sm:mx-auto">
                  <Icon className="h-4 w-4" aria-hidden />
                </motion.div>
                <motion.div className="min-w-0 sm:text-center">
                  <p className="font-outfit text-[0.8125rem] font-semibold tracking-[0.03em] text-ink-primary">
                    {title}
                  </p>
                  <p className="mt-1 text-[0.72rem] leading-[1.5] text-ink-secondary sm:leading-[1.48]">
                    {description}
                  </p>
                </motion.div>
              </li>
            ))}
          </motion.ul>

          <motion.div
            className="mt-5 border-t border-white/[0.1] pt-4 md:mt-5 md:pt-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={revealInView}
            transition={{ duration: reduce ? 0 : 0.58, delay: reduce ? 0 : 0.06 }}
          >
            <p className="font-display text-[1.45rem] italic leading-none text-ink-primary md:text-[1.6rem]">
              {studioAbout.directorName}
            </p>
            <p className="label-upper mt-1.5 text-ink-muted" style={{ fontVariantCaps: "all-small-caps" }}>
              {studioAbout.directorRole}
            </p>
          </motion.div>
        </ScrollReveal>

        <ScrollReveal
          dramatic
          delay={0.05}
          className="flex items-center justify-center lg:justify-center"
        >
          <div className="relative mx-auto aspect-[3/4] w-full max-w-[min(100%,280px)] overflow-hidden rounded-2xl border border-gold/25 shadow-[0_16px_48px_rgba(0,0,0,0.45)] sm:max-w-[300px] lg:max-h-[min(72vh,480px)] lg:w-full lg:max-w-[min(100%,320px)]">
            <Image
              src={studioAbout.directorPortrait}
              alt={studioAbout.directorPortraitAlt}
              fill
              className="object-cover object-center"
              sizes="(max-width: 1024px) 85vw, 320px"
              priority
            />
            <motion.div
              aria-hidden
              className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#12100c]/80 to-transparent"
            />
            <p className="absolute inset-x-0 bottom-0 px-3 py-2.5 text-center text-[0.58rem] uppercase leading-snug tracking-[0.16em] text-ink-primary">
              {studioAbout.directorName} — {studioAbout.logoWordmark} {studioAbout.logoSub}
            </p>
          </div>
        </ScrollReveal>
      </RevealChildren>
    </section>
  );
}
