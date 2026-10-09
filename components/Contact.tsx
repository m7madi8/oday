"use client";

import { AnimatedHeading } from "@/components/animations/AnimatedHeading";
import { RevealFade } from "@/components/animations/RevealFade";
import { OfficeVisitCard } from "@/components/OfficeVisitCard";
import { about as studioAbout } from "@/lib/content/about";
import { contact, footer } from "@/lib/content/contact";
import { StudioStats } from "@/components/StudioStats";
import { useMobilePerfMode } from "@/hooks/useMobilePerfMode";
import { sectionInView } from "@/lib/motion-viewport";
import { SectionRevealContext } from "@/lib/section-reveal-context";
import { useInView, useReducedMotion } from "@/components/ClientMotion";
import { Facebook, Instagram, Mail, MapPin, Phone } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";

const socialIcons = {
  facebook: Facebook,
  instagram: Instagram,
} as const;

const focusRing =
  "outline-none transition-colors duration-300 focus-visible:text-gold focus-visible:underline focus-visible:decoration-gold/70 focus-visible:underline-offset-4";

const contactIcons = {
  Location: MapPin,
  Email: Mail,
  Phone: Phone,
} as const;

type ContactItem = (typeof contact.items)[number];

function ContactChannelButton({
  item,
  delay,
  className = "",
}: {
  item: ContactItem;
  delay: number;
  className?: string;
}) {
  const Icon = contactIcons[item.label as keyof typeof contactIcons];
  const label = item.label.toUpperCase();

  const inner = (
    <>
      <span className="contact-channel__icon" aria-hidden>
        <Icon className="h-[18px] w-[18px]" strokeWidth={1.5} />
      </span>
      <span className="contact-channel__body">
        <span className="contact-channel__label">{label}</span>
        <span
          className={`contact-channel__value${
            item.label === "Email" ? " contact-channel__value--email" : ""
          }`}
        >
          {item.value}
        </span>
      </span>
    </>
  );

  if (!item.href) {
    return (
      <RevealFade as="div" delay={delay} className={`min-w-0 ${className}`.trim()}>
        <div className="contact-channel">{inner}</div>
      </RevealFade>
    );
  }

  return (
    <RevealFade as="div" delay={delay} className={`min-w-0 ${className}`.trim()}>
      <a
        href={item.href}
        className={`contact-channel ${focusRing}`}
        {...(item.label === "Location"
          ? { target: "_blank", rel: "noopener noreferrer" }
          : {})}
      >
        {inner}
      </a>
    </RevealFade>
  );
}

export function Contact() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const reduceMotion = useReducedMotion();
  const mobilePerf = useMobilePerfMode();
  const inView = useInView(sectionRef, sectionInView);
  const baseDelay = 0.04;

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="contact-section relative overflow-visible scroll-mt-20"
    >
      <SectionRevealContext.Provider
        value={{
          revealed: inView,
          lightMotion: reduceMotion || mobilePerf,
        }}
      >
        <div className="contact-shell">
          <div className="contact-board">
            <RevealFade as="div" delay={baseDelay} className="contact-section__portrait">
              <figure className="contact-portrait-frame">
                <span className="contact-portrait-frame__corner contact-portrait-frame__corner--tl" aria-hidden />
                <span className="contact-portrait-frame__corner contact-portrait-frame__corner--tr" aria-hidden />
                <span className="contact-portrait-frame__corner contact-portrait-frame__corner--bl" aria-hidden />
                <span className="contact-portrait-frame__corner contact-portrait-frame__corner--br" aria-hidden />
                <Image
                  src={studioAbout.directorPortrait}
                  alt={studioAbout.directorPortraitAlt}
                  sizes="(max-width: 768px) 18rem, (max-width: 1440px) 22rem, 26rem"
                  className="contact-portrait-frame__img"
                />
              </figure>
            </RevealFade>

            <div className="contact-section__bio">
              <RevealFade as="p" className="contact-bio__eyebrow" delay={baseDelay + 0.08}>
                {studioAbout.contactEyebrow}
              </RevealFade>

              <div className="contact-director__identity">
                <AnimatedHeading
                  as="h2"
                  text={studioAbout.directorName}
                  className="contact-bio__name"
                  delay={baseDelay + 0.14}
                  duration={0.88}
                  splitByWords
                  wordStagger={0.05}
                />

                <RevealFade as="div" delay={baseDelay + 0.24} aria-hidden>
                  <span className="contact-director__mark" />
                </RevealFade>

                <RevealFade
                  as="div"
                  delay={baseDelay + 0.3}
                  className="contact-director__signature-wrap"
                >
                  <Image
                    src={studioAbout.directorSignature}
                    alt=""
                    aria-hidden
                    sizes="(max-width: 768px) 10rem, 12rem"
                    className="contact-director__signature"
                  />
                </RevealFade>
              </div>

              <RevealFade
                as="p"
                className="contact-bio__approach"
                delay={baseDelay + 0.36}
              >
                {studioAbout.approachSubheading}
              </RevealFade>

              <RevealFade
                as="p"
                className="contact-bio__tagline"
                delay={baseDelay + 0.42}
              >
                {studioAbout.studioTagline}
              </RevealFade>

              <StudioStats />
            </div>

            <div className="contact-section__office">
              <OfficeVisitCard delay={baseDelay + 0.16} />
            </div>
          </div>

          <div className="contact-channels-bar">
            {contact.items.map((item, index) => (
              <ContactChannelButton
                key={item.label}
                item={item}
                delay={baseDelay + 0.5 + index * 0.08}
                className={`contact-channel-slot contact-channel-slot--${item.label.toLowerCase()}`}
              />
            ))}
          </div>

          <footer id="footer" className="contact-section__footer">
            <div className="contact-footer__row">
              <nav aria-label="Footer" className="contact-footer__nav">
                {footer.bottomBarLinks.map((link, index) => (
                  <RevealFade
                    key={link.href + link.label}
                    as="span"
                    delay={baseDelay + 0.85 + index * 0.04}
                    className="inline-flex"
                  >
                    <Link
                      href={link.href}
                      className={`contact-footer__link ${focusRing}`}
                    >
                      {link.label}
                    </Link>
                  </RevealFade>
                ))}
              </nav>

              <div className="contact-footer__meta">
                <RevealFade
                  as="p"
                  className="contact-footer__copy"
                  delay={baseDelay + 1.05}
                >
                  {footer.copyright}
                </RevealFade>
                <div className="contact-footer__social">
                  {footer.social.map((social, index) => {
                    const Icon = socialIcons[social.icon];
                    return (
                      <RevealFade
                        key={social.label}
                        as="span"
                        delay={baseDelay + 1.1 + index * 0.04}
                        className="inline-flex"
                      >
                        <a
                          href={social.href}
                          aria-label={social.label}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="contact-footer__social-btn"
                        >
                          <Icon className="h-4 w-4" strokeWidth={1.5} aria-hidden />
                        </a>
                      </RevealFade>
                    );
                  })}
                </div>
              </div>
            </div>
          </footer>
        </div>
      </SectionRevealContext.Provider>
    </section>
  );
}
