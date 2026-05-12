"use client";

import { CounterNumber } from "@/components/animations/CounterNumber";
import { GsapStaggerReveal } from "@/components/animations/GsapStaggerReveal";
import { RevealChildren } from "@/components/animations/RevealChildren";
import { RevealText } from "@/components/animations/RevealText";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { motion, useReducedMotion } from "framer-motion";
import { revealInView } from "@/lib/motion-viewport";
import Image from "next/image";
import { useRef } from "react";
import aboutSectionImage from "@/imgs/about.jpg";

const stats = [
  { target: 180, suffix: "+", label: "Projects" },
  { target: 8, suffix: "", label: "Years" },
  { target: 91, suffix: "%", label: "Repeat Clients" },
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
        <ScrollReveal as="article" dramatic className="flex flex-col justify-between rounded-2xl border border-gold/25 bg-bg-card/80 p-6 md:p-8 lg:p-10">
          <div>
            <motion.p
              className="label-upper text-gold"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={revealInView}
              transition={{ duration: reduce ? 0 : 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              COMPANY SNAPSHOT
            </motion.p>

            <h2 className="mt-4 font-display text-[clamp(2.2rem,5.1vw,4.2rem)] italic leading-[0.96] text-ink-primary">
              <RevealText as="span" className="block" splitByWords wordStagger={0.06} duration={0.85}>
                Built for Serious
              </RevealText>{" "}
              <RevealText as="span" className="text-gold" splitByWords wordStagger={0.07} duration={0.85} delay={0.12}>
                Developers
              </RevealText>
            </h2>

            <motion.p
              className="mt-5 max-w-2xl text-sm leading-relaxed text-ink-secondary md:text-base"
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={revealInView}
              transition={{ duration: reduce ? 0 : 0.62, delay: reduce ? 0 : 0.08, ease: [0.22, 1, 0.36, 1] }}
            >
              Architecture, interiors, and engineering - one accountable team.
            </motion.p>

            <motion.div
              className="mt-8 h-px w-12 bg-gold/55"
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={revealInView}
              transition={{ duration: reduce ? 0 : 0.75, delay: reduce ? 0 : 0.12, ease: [0.22, 1, 0.36, 1] }}
              style={{ transformOrigin: "left center" }}
            />

            <div ref={statsRowRef}>
              <GsapStaggerReveal className="mt-9 flex flex-wrap items-stretch">
                {stats.map((stat, idx) => (
                  <div
                    key={stat.label}
                    data-reveal-item
                    className={`px-4 py-1 md:px-6 ${idx < stats.length - 1 ? "border-r border-gold/28" : ""}`}
                  >
                    <p className="font-display text-[2.2rem] italic leading-none text-ink-primary md:text-[2.5rem]">
                      <CounterNumber
                        targetNumber={stat.target}
                        suffix={stat.suffix}
                        triggerRef={statsRowRef}
                        delay={reduce ? 0 : idx * 0.14}
                        duration={1.75}
                        enabled={!reduce}
                        start="top 88%"
                      />
                    </p>
                    <p className="label-upper mt-2 text-ink-muted">{stat.label}</p>
                  </div>
                ))}
              </GsapStaggerReveal>
            </div>

            <GsapStaggerReveal className="mt-10 space-y-3.5" start="top 88%" stagger={0.1}>
              {pillars.map((title, idx) => (
                <div key={title} data-reveal-item className="flex items-center gap-3">
                  <span className="label-upper text-gold">
                    {(idx + 1).toString().padStart(2, "0")}
                  </span>
                  <p className="label-upper text-ink-primary">{title}</p>
                  <span className="h-px flex-1 bg-gold/30" />
                </div>
              ))}
            </GsapStaggerReveal>
          </div>

          <motion.div
            className="mt-10 border-t border-gold/28 pt-5"
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
