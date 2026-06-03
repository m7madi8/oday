"use client";

import { CounterNumber } from "@/components/animations/CounterNumber";
import { RevealChildren } from "@/components/animations/RevealChildren";
import { RevealText } from "@/components/animations/RevealText";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { motion, useReducedMotion } from "@/components/ClientMotion";
import { revealInView } from "@/lib/motion-viewport";
import { about as studioAbout } from "@/lib/content/about";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { SectionInner, SectionShell } from "@/components/SectionShell";

export function About() {
  const reduce = useReducedMotion();
  const statsTriggerRef = useRef<HTMLDivElement>(null);
  const [statsInView, setStatsInView] = useState(false);

  useEffect(() => {
    if (reduce) {
      setStatsInView(true);
      return;
    }

    const section = document.getElementById("about");
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setStatsInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.18, rootMargin: "0px 0px -12% 0px" },
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, [reduce]);

  return (
    <SectionShell id="about">
      <SectionInner>
      <RevealChildren
        className="relative grid w-full items-center gap-6 md:gap-7 lg:grid-cols-[minmax(0,1.08fr)_minmax(240px,0.92fr)] lg:gap-10"
        stagger={0.07}
      >
        <ScrollReveal
          as="article"
          dramatic
          className="about-snapshot"
        >
          <span className="about-snapshot__frame" aria-hidden />
          <span className="about-snapshot__corner about-snapshot__corner--tl" aria-hidden />
          <span className="about-snapshot__corner about-snapshot__corner--tr" aria-hidden />
          <span className="about-snapshot__corner about-snapshot__corner--bl" aria-hidden />
          <span className="about-snapshot__corner about-snapshot__corner--br" aria-hidden />
          <span className="about-snapshot__grid" aria-hidden />

          <header className="about-snapshot__header">
            <motion.div
              className="about-snapshot__header-copy"
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
            <span className="about-snapshot__index label-upper" aria-hidden>
              {studioAbout.sectionNumber}
            </span>
          </header>

          <motion.div
            ref={statsTriggerRef}
            className="about-snapshot__stats"
            initial={reduce ? false : { opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.35, margin: "0px 0px -8% 0px" }}
            transition={{ duration: reduce ? 0 : 0.55, ease: [0.22, 1, 0.36, 1] }}
          >
            {studioAbout.stats.map((stat, idx) => (
              <motion.div
                key={stat.label}
                className="about-snapshot__stat"
                initial={reduce ? false : { opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{
                  duration: reduce ? 0 : 0.45,
                  delay: reduce ? 0 : 0.04 + idx * 0.05,
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                <span className="about-snapshot__stat-index" aria-hidden>
                  {String(idx + 1).padStart(2, "0")}
                </span>
                <p className="about-snapshot__stat-value">
                  <CounterNumber
                    targetNumber={stat.target}
                    prefix={stat.prefix}
                    suffix={stat.suffix}
                    delay={reduce ? 0 : 0.15 + idx * 0.35}
                    duration={reduce ? 0 : 2.2}
                    enabled={statsInView && !reduce}
                    holdAtZero={!statsInView && !reduce}
                    triggerRef={statsTriggerRef}
                  />
                </p>
                <p className="about-snapshot__stat-label">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>

          <div className="about-snapshot__body">
            <motion.p
              className="about-snapshot__intro"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={revealInView}
              transition={{ duration: reduce ? 0 : 0.55, delay: reduce ? 0 : 0.04, ease: [0.22, 1, 0.36, 1] }}
            >
              {studioAbout.introParagraph}
            </motion.p>

            <h2 className="about-snapshot__headline">
              <RevealText as="span" className="block" splitByWords wordStagger={0.06} duration={0.85}>
                {studioAbout.headlinePrimary}
              </RevealText>{" "}
              <RevealText as="span" className="text-gold/90" splitByWords wordStagger={0.07} duration={0.85} delay={0.12}>
                {studioAbout.headlineAccent}
              </RevealText>
            </h2>

            <motion.ul
              className="about-snapshot__strengths"
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={revealInView}
              transition={{ duration: reduce ? 0 : 0.5, delay: reduce ? 0 : 0.08 }}
            >
              {studioAbout.strengths.map(({ title, description }, idx) => (
                <li key={title} className="about-snapshot__strength">
                  <span className="about-snapshot__strength-index" aria-hidden>
                    {String(idx + 1).padStart(2, "0")}
                  </span>
                  <div className="about-snapshot__strength-copy">
                    <p className="about-snapshot__strength-title">{title}</p>
                    <p className="about-snapshot__strength-desc">{description}</p>
                  </div>
                </li>
              ))}
            </motion.ul>
          </div>
        </ScrollReveal>

        <ScrollReveal
          dramatic
          delay={0.05}
          className="about-portrait-wrap flex items-center justify-center lg:justify-end"
        >
          <figure className="about-portrait">
            <div className="about-portrait__ghost" aria-hidden />

            <div className="about-portrait__shell">
              <span className="about-portrait__corner about-portrait__corner--tl" aria-hidden />
              <span className="about-portrait__corner about-portrait__corner--br" aria-hidden />
              <span className="about-portrait__index label-upper" aria-hidden>
                {studioAbout.sectionNumber}
              </span>

              <div className="about-portrait__media">
                <Image
                  src={studioAbout.directorPortrait}
                  alt={studioAbout.directorPortraitAlt}
                  fill
                  className="about-portrait__img"
                  sizes="(max-width: 1024px) 88vw, 360px"
                  loading="lazy"
                />
                <div className="about-portrait__veil" aria-hidden />
              </div>

              <figcaption className="about-portrait__caption">
                <p className="label-upper text-gold/80">{studioAbout.logoWordmark} {studioAbout.logoSub}</p>
                <p className="about-portrait__name">{studioAbout.directorName}</p>
                <p className="about-portrait__role">{studioAbout.directorRole}</p>
              </figcaption>
            </div>
          </figure>
        </ScrollReveal>
      </RevealChildren>
      </SectionInner>
    </SectionShell>
  );
}
