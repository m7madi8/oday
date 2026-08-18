"use client";

import { CounterNumber } from "@/components/animations/CounterNumber";
import { RevealText } from "@/components/animations/RevealText";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { motion, useReducedMotion } from "@/components/ClientMotion";
import { about as studioAbout } from "@/lib/content/about";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { SectionInner, SectionShell } from "@/components/SectionShell";

export function About() {
  const reduce = useReducedMotion();
  const statsRef = useRef<HTMLDivElement>(null);
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
      { threshold: 0.2, rootMargin: "0px 0px -8% 0px" },
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, [reduce]);

  return (
    <SectionShell id="about" className="about-arch" snap={false}>
      <SectionInner className="about-arch__inner">
        <ScrollReveal dramatic className="about-arch__visual">
          <figure className="about-arch__figure">
            <div className="about-arch__plate">
              <span className="about-arch__spine" aria-hidden>
                Principal
              </span>
              <div className="about-arch__media">
                <Image
                  src={studioAbout.directorPortrait}
                  alt={studioAbout.directorPortraitAlt}
                  fill
                  className="about-arch__img"
                  sizes="(max-width: 1023px) 92vw, 420px"
                  loading="lazy"
                />
                <span className="about-arch__mark" aria-hidden />
              </div>
            </div>
            <figcaption className="about-arch__titleblock">
              <span className="about-arch__titleblock-no">{studioAbout.sectionNumber}</span>
              <span className="about-arch__titleblock-name">{studioAbout.directorName}</span>
              <span className="about-arch__titleblock-role">{studioAbout.directorRole}</span>
            </figcaption>
          </figure>
        </ScrollReveal>

        <div className="about-arch__content">
          <ScrollReveal dramatic>
            <p className="label-upper about-arch__eyebrow">{studioAbout.snapshotEyebrow}</p>
          </ScrollReveal>

          <ScrollReveal dramatic delay={0.04}>
            <h2 className="about-arch__headline">
              <RevealText as="span" className="about-arch__headline-main" splitByWords wordStagger={0.05} duration={0.75}>
                {studioAbout.headlinePrimary}
              </RevealText>
              <RevealText
                as="span"
                className="about-arch__headline-accent"
                splitByWords
                wordStagger={0.05}
                duration={0.75}
                delay={0.08}
              >
                {studioAbout.headlineAccent}
              </RevealText>
            </h2>
          </ScrollReveal>

          <ScrollReveal delay={0.06}>
            <p className="about-arch__lede">
              <span className="about-arch__lede-brand">
                {studioAbout.logoWordmark} {studioAbout.logoSub}
              </span>
              <span className="about-arch__lede-text">{studioAbout.studioTagline}</span>
            </p>
          </ScrollReveal>

          <ScrollReveal delay={0.08}>
            <div className="about-arch__proof">
              <ol className="about-arch__manifesto">
                {studioAbout.strengths.map(({ title, description }, idx) => (
                  <li key={title} className="about-arch__manifesto-item">
                    <span className="about-arch__manifesto-no" aria-hidden>
                      {String(idx + 1).padStart(2, "0")}
                    </span>
                    <div className="about-arch__manifesto-body">
                      <p className="about-arch__manifesto-title">{title}</p>
                      <p className="about-arch__manifesto-desc">{description}</p>
                    </div>
                  </li>
                ))}
              </ol>

              <motion.div
                ref={statsRef}
                className="about-arch__stats"
                initial={reduce ? false : { opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: reduce ? 0 : 0.45, ease: [0.22, 1, 0.36, 1] }}
              >
                {studioAbout.stats.map((stat, idx) => (
                  <p key={stat.label} className="about-arch__stat">
                    <span className="about-arch__stat-value">
                      <CounterNumber
                        targetNumber={stat.target}
                        prefix={stat.prefix}
                        suffix={stat.suffix}
                        delay={reduce ? 0 : 0.1 + idx * 0.2}
                        duration={reduce ? 0 : 1.6}
                        enabled={statsInView}
                        holdAtZero={!statsInView && !reduce}
                        triggerRef={statsRef}
                      />
                    </span>
                    <span className="about-arch__stat-label">{stat.label}</span>
                  </p>
                ))}
              </motion.div>
            </div>
          </ScrollReveal>
        </div>
      </SectionInner>
    </SectionShell>
  );
}
