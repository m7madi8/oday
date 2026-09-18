"use client";

import { AnimatedHeading } from "@/components/animations/AnimatedHeading";
import { RevealFade } from "@/components/animations/RevealFade";
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

const fieldLabel =
  "font-ui text-xs font-medium uppercase tracking-widest text-gold/70";
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
  variant = "default",
}: {
  item: ContactItem;
  delay: number;
  variant?: "default" | "location";
}) {
  const Icon = contactIcons[item.label as keyof typeof contactIcons];

  if (!item.href) {
    return (
      <RevealFade as="div" delay={delay} className="min-w-0">
        <div
          className={`contact-channel${variant === "location" ? " contact-channel--location" : ""}`}
        >
          <span className="contact-channel__icon" aria-hidden>
            <Icon className="h-[18px] w-[18px]" strokeWidth={1.5} />
          </span>
          <span className="contact-channel__body">
            <span className={fieldLabel}>{item.label}</span>
            <span className="contact-channel__value">{item.value}</span>
          </span>
        </div>
      </RevealFade>
    );
  }

  return (
    <RevealFade as="div" delay={delay} className="min-w-0">
      <a
        href={item.href}
        className={`contact-channel ${focusRing}${
          variant === "location" ? " contact-channel--location" : ""
        }`}
        {...(item.label === "Location"
          ? { target: "_blank", rel: "noopener noreferrer" }
          : {})}
      >
        <span className="contact-channel__icon" aria-hidden>
          <Icon className="h-[18px] w-[18px]" strokeWidth={1.5} />
        </span>
        <span className="contact-channel__body">
          <span className={fieldLabel}>{item.label}</span>
          <span
            className={`contact-channel__value${
              item.label === "Email" ? " contact-channel__value--email" : ""
            }`}
          >
            {item.value}
          </span>
        </span>
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
      className="contact-section relative overflow-visible border-t border-white/10 bg-[#0A0A0A] pb-8 pt-16 scroll-mt-20 md:pb-10 md:pt-24"
    >
      <SectionRevealContext.Provider
        value={{
          revealed: inView,
          lightMotion: reduceMotion || mobilePerf,
        }}
      >
        <div className="mx-auto w-full max-w-7xl px-6 md:px-8 lg:px-10">
          <header className="mb-16 grid grid-cols-1 items-center gap-10 md:mb-20 md:grid-cols-[minmax(16rem,22rem)_auto_minmax(0,1fr)] md:gap-10 lg:gap-14">
            <RevealFade as="div" delay={baseDelay} className="m-0">
              <figure className="relative mx-auto w-full max-w-[20rem] border border-white/10 p-3 md:mx-0 md:max-w-none md:p-4">
                <span
                  className="pointer-events-none absolute left-0 top-0 h-5 w-5 border-l border-t border-gold/70"
                  aria-hidden
                />
                <span
                  className="pointer-events-none absolute right-0 top-0 h-5 w-5 border-r border-t border-gold/70"
                  aria-hidden
                />
                <span
                  className="pointer-events-none absolute bottom-0 left-0 h-5 w-5 border-b border-l border-gold/70"
                  aria-hidden
                />
                <span
                  className="pointer-events-none absolute bottom-0 right-0 h-5 w-5 border-b border-r border-gold/70"
                  aria-hidden
                />
                <Image
                  src={studioAbout.directorPortrait}
                  alt={studioAbout.directorPortraitAlt}
                  sizes="(max-width: 768px) 20rem, 22rem"
                  className="h-auto w-full"
                />
              </figure>
            </RevealFade>

            <RevealFade
              as="div"
              delay={baseDelay + 0.06}
              className="hidden h-36 md:block"
            >
              <span className="block h-full w-px bg-gold/35" aria-hidden />
            </RevealFade>

            <div className="max-w-xl text-center md:text-left">
              <RevealFade as="p" className={fieldLabel} delay={baseDelay + 0.1}>
                {studioAbout.contactEyebrow}
              </RevealFade>

              <div className="contact-director__identity">
                <AnimatedHeading
                  as="h2"
                  text={studioAbout.directorName}
                  className="mt-4 font-display text-2xl font-light italic tracking-tight text-white md:text-4xl"
                  delay={baseDelay + 0.18}
                  duration={0.88}
                  splitByWords
                  wordStagger={0.05}
                />

                <RevealFade
                  as="div"
                  delay={baseDelay + 0.3}
                  className="contact-director__underline"
                  aria-hidden
                />
              </div>

              <RevealFade
                as="p"
                className="mt-5 font-ui text-xs font-medium uppercase tracking-widest text-white/55"
                delay={baseDelay + 0.38}
              >
                {studioAbout.directorRole}
              </RevealFade>

              <RevealFade
                as="p"
                className="mt-4 text-base font-light leading-relaxed text-white/55"
                delay={baseDelay + 0.46}
              >
                {studioAbout.studioTagline}
              </RevealFade>

              <StudioStats />
            </div>
          </header>

          <div className="contact-section__close">
            <div className="contact-channels">
              <div className="contact-channels__primary">
                {contact.items
                  .filter((item) => item.label !== "Location")
                  .map((item, index) => (
                    <ContactChannelButton
                      key={item.label}
                      item={item}
                      delay={baseDelay + 0.58 + index * 0.12}
                    />
                  ))}
              </div>

              {contact.items
                .filter((item) => item.label === "Location")
                .map((item) => (
                  <div key={item.label} className="contact-channels__aside">
                    <ContactChannelButton
                      item={item}
                      delay={baseDelay + 0.82}
                      variant="location"
                    />
                  </div>
                ))}
            </div>

            <footer id="footer" className="contact-section__footer">
              <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
                <nav aria-label="Footer" className="flex flex-wrap items-center gap-x-8 gap-y-3">
                  {footer.bottomBarLinks.map((link, index) => (
                    <RevealFade
                      key={link.href + link.label}
                      as="span"
                      delay={baseDelay + 0.98 + index * 0.05}
                      className="inline-flex"
                    >
                      <Link
                        href={link.href}
                        className={`font-ui text-xs font-normal uppercase tracking-widest text-white/55 hover:text-gold ${focusRing}`}
                      >
                        {link.label}
                      </Link>
                    </RevealFade>
                  ))}
                </nav>

                <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:gap-8">
                  <RevealFade
                    as="p"
                    className="text-xs font-light text-white/40"
                    delay={baseDelay + 1.18}
                  >
                    {footer.copyright}
                  </RevealFade>
                  <div className="flex items-center gap-3">
                    {footer.social.map((social, index) => {
                      const Icon = socialIcons[social.icon];
                      return (
                        <RevealFade
                          key={social.label}
                          as="span"
                          delay={baseDelay + 1.24 + index * 0.05}
                          className="inline-flex"
                        >
                          <a
                            href={social.href}
                            aria-label={social.label}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 text-white/70 outline-none transition-colors duration-300 hover:border-gold hover:bg-gold/10 hover:text-gold focus-visible:border-gold focus-visible:bg-gold/10 focus-visible:text-gold"
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
        </div>
      </SectionRevealContext.Provider>
    </section>
  );
}
