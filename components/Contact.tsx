"use client";

import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { submitContactForm } from "@/lib/contact-form";
import { contact, footer } from "@/lib/content/contact";
import { studioLocation } from "@/lib/content/location";
import { revealInView, softInView } from "@/lib/motion-viewport";
import { motion, useReducedMotion } from "@/components/ClientMotion";
import { Facebook, Instagram, Navigation } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { SectionHeader, SectionInner, SectionShell } from "@/components/SectionShell";

import brandLogo from "@/imgs/oday-logo.png";

const socialIcons = {
  facebook: Facebook,
  instagram: Instagram,
} as const;

const glassPill =
  "inline-flex items-center justify-center rounded-full border border-white/25 bg-white/[0.1] px-8 py-3.5 text-[13px] font-normal tracking-[0.14em] text-white shadow-[0_8px_40px_rgba(0,0,0,0.2)] backdrop-blur-xl transition-[background-color,transform,border-color] duration-300 hover:border-white/40 hover:bg-white/[0.16] active:scale-[0.98]";

const glassPillGold =
  "inline-flex items-center justify-center gap-2 rounded-full border border-gold/45 bg-gold/15 px-8 py-3.5 text-[13px] font-normal tracking-[0.14em] text-white shadow-[0_8px_40px_rgba(0,0,0,0.2)] backdrop-blur-xl transition-[background-color,transform,border-color] duration-300 hover:border-gold/60 hover:bg-gold/25 active:scale-[0.98]";

export function Contact() {
  const reduceMotion = useReducedMotion();
  const email =
    contact.items.find((i) => i.label === "Email")?.value ?? "abodohaoday@gmail.com";
  const [newsletter, setNewsletter] = useState("");
  const [newsletterHoneypot, setNewsletterHoneypot] = useState("");
  const [newsletterError, setNewsletterError] = useState<string | null>(null);
  const [newsletterSubmitting, setNewsletterSubmitting] = useState(false);
  const [newsletterSent, setNewsletterSent] = useState(false);

  async function onNewsletterSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (newsletterSubmitting || newsletterSent) return;

    const trimmed = newsletter.trim();
    if (!trimmed) return;

    setNewsletterError(null);
    setNewsletterSubmitting(true);

    const result = await submitContactForm({
      type: "newsletter",
      email: trimmed,
      _gotcha: newsletterHoneypot,
    });

    setNewsletterSubmitting(false);

    if (!result.ok) {
      setNewsletterError(result.error);
      return;
    }

    setNewsletterSent(true);
    setNewsletter("");
  }

  return (
    <SectionShell
      id="contact"
      variant="media"
      className="h-[100svh] max-h-[100svh] overflow-hidden"
    >
      <div className="absolute inset-0">
        <Image
          src={contact.backgroundImage}
          alt={contact.backgroundAlt}
          fill
          className="object-cover object-center"
          sizes="100vw"
          loading="lazy"
        />
        {/* Full-screen scrim — light mid, stronger only at very top/bottom for type */}
        <div
          className="absolute inset-0"
          aria-hidden
          style={{
            background: `
              linear-gradient(180deg,
                rgba(12,12,12,0.78) 0%,
                rgba(12,12,12,0.35) 18%,
                rgba(12,12,12,0.2) 42%,
                rgba(10,10,10,0.45) 62%,
                rgba(8,8,8,0.82) 82%,
                rgba(6,6,6,0.94) 100%
              )
            `,
          }}
        />
      </div>

      {/* True full-viewport stage: CTA grows, footer pinned to bottom edge */}
      <SectionInner className="relative z-[1] grid h-full min-h-0 grid-rows-[minmax(0,1fr)_auto] pt-[var(--hero-nav-stack)]">
        {/* ——— Upper stage: CTA fills the open photo ——— */}
        <ScrollReveal
          dramatic
          className="flex h-full min-h-0 flex-col justify-center py-6 md:py-8 lg:py-10"
        >
          <div className="max-w-3xl">
            <SectionHeader
              align="start"
              eyebrow="Start Here"
              title={<span className="text-white">{contact.heading}</span>}
              description={contact.description}
              className="[&_.label-upper]:text-white/70 [&_.section-lead]:max-w-[42ch] [&_.section-lead]:text-white/80 [&_.section-title]:max-w-[22ch] [&_.section-title]:text-[clamp(2rem,4.8vw,3.15rem)] [&_.section-title]:text-white"
            />
            <motion.div
              className="mt-8 flex flex-col gap-3 sm:mt-10 sm:flex-row sm:flex-wrap sm:items-center"
              initial={{ opacity: reduceMotion ? 1 : 0, y: reduceMotion ? 0 : 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={revealInView}
              transition={{
                duration: reduceMotion ? 0 : 0.45,
                delay: reduceMotion ? 0 : 0.1,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              <Link href={`mailto:${email}`} className={glassPill} aria-label={contact.ctaLabel}>
                {contact.ctaLabel}
              </Link>
              <a
                href={studioLocation.directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={glassPillGold}
                aria-label={`Get directions to OD Architects, ${studioLocation.addressLine2}`}
              >
                <Navigation className="h-4 w-4 shrink-0" strokeWidth={1.75} aria-hidden />
                Get Directions
              </a>
            </motion.div>
          </div>
        </ScrollReveal>

        {/* ——— Lower stage: utility sits on the bottom of the screen ——— */}
        <footer id="footer" className="relative shrink-0 pb-3 pt-4 md:pb-4 md:pt-5">
          <motion.div
            className="flex flex-col gap-4 md:gap-5"
            initial={{ opacity: 1, y: reduceMotion ? 0 : 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={softInView}
            transition={{ duration: reduceMotion ? 0 : 0.4 }}
          >
            <div className="grid grid-cols-1 gap-5 md:grid-cols-12 md:items-start md:gap-7">
              {/* Contact channels */}
              <div className="grid grid-cols-3 gap-4 md:col-span-7 md:gap-6">
                {contact.items.map((item) => (
                  <div key={item.label} className="min-w-0">
                    <p className="font-outfit text-[10px] font-medium uppercase tracking-[0.2em] text-white/50">
                      {item.label}
                    </p>
                    {item.href ? (
                      <a
                        href={item.href}
                        className="mt-1.5 block text-[13px] leading-snug text-white/90 transition-colors hover:text-white md:text-sm"
                        {...(item.label === "Location"
                          ? { target: "_blank", rel: "noopener noreferrer" }
                          : {})}
                      >
                        {item.value}
                      </a>
                    ) : (
                      <p className="mt-1.5 text-[13px] leading-snug text-white/90 md:text-sm">
                        {item.value}
                      </p>
                    )}
                    {item.label === "Location" ? (
                      <a
                        href={studioLocation.directionsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-2 inline-flex items-center gap-1.5 font-outfit text-[10px] font-medium uppercase tracking-[0.16em] text-gold/90 transition-colors hover:text-gold"
                      >
                        <Navigation className="h-3 w-3" strokeWidth={2} aria-hidden />
                        Directions
                      </a>
                    ) : null}
                  </div>
                ))}
              </div>

              {/* Newsletter */}
              <div className="md:col-span-5">
                <p className="font-outfit text-[10px] font-medium uppercase tracking-[0.2em] text-white/50">
                  Newsletter
                </p>
                <form
                  className="mt-2 flex flex-col gap-2.5 sm:flex-row sm:items-stretch"
                  autoComplete="off"
                  onSubmit={onNewsletterSubmit}
                >
                  <input
                    type="text"
                    name="_gotcha"
                    value={newsletterHoneypot}
                    onChange={(e) => setNewsletterHoneypot(e.target.value)}
                    tabIndex={-1}
                    autoComplete="off"
                    aria-hidden
                    className="pointer-events-none absolute left-[-9999px] h-0 w-0 opacity-0"
                  />
                  <label htmlFor="footer-newsletter-email" className="sr-only">
                    Your email
                  </label>
                  <input
                    id="footer-newsletter-email"
                    type="email"
                    name="email"
                    autoComplete="email"
                    placeholder="Your email"
                    value={newsletter}
                    onChange={(e) => setNewsletter(e.target.value)}
                    className="min-w-0 flex-1 rounded-none border border-white/35 bg-black/45 px-4 py-2.5 text-sm text-white outline-none backdrop-blur-[2px] placeholder:text-white/40 transition-[border-color,background-color] duration-300 focus:border-gold/55 focus:bg-black/55"
                    disabled={newsletterSubmitting || newsletterSent}
                    suppressHydrationWarning
                  />
                  <button
                    type="submit"
                    disabled={newsletterSubmitting || newsletterSent}
                    className={`${glassPill} shrink-0 px-6 py-2.5 tracking-[0.12em] disabled:cursor-not-allowed disabled:opacity-60`}
                  >
                    {newsletterSubmitting ? "Sending…" : newsletterSent ? "Subscribed" : "Submit"}
                  </button>
                </form>
                {newsletterError ? (
                  <p className="mt-1.5 text-xs text-red-200/90">{newsletterError}</p>
                ) : newsletterSent ? (
                  <p className="mt-1.5 text-xs text-emerald-100/90">Thanks — you&apos;re on the list.</p>
                ) : null}
              </div>
            </div>

            <div className="h-px w-full bg-gradient-to-r from-transparent via-white/20 to-transparent" aria-hidden />

            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between lg:gap-8">
              <nav
                aria-label="Footer"
                className="flex flex-wrap items-center gap-x-5 gap-y-2 sm:gap-x-7"
              >
                {footer.bottomBarLinks.map((l) => (
                  <Link
                    key={l.href + l.label}
                    href={l.href}
                    className="font-outfit text-[12px] font-normal uppercase tracking-[0.14em] text-white/75 transition-colors duration-300 hover:text-gold md:text-[13px]"
                  >
                    {l.label}
                  </Link>
                ))}
              </nav>

              <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
                <p className="text-[12px] text-white/50 md:text-[13px]">{footer.copyright}</p>
                <div className="flex gap-2.5">
                  {footer.social.map((s) => {
                    const Icon = socialIcons[s.icon];
                    return (
                      <a
                        key={s.label}
                        href={s.href}
                        aria-label={s.label}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 text-white/80 transition-[background-color,color,border-color] duration-300 hover:border-white/35 hover:bg-white/[0.08] hover:text-white"
                      >
                        <Icon className="h-4 w-4" strokeWidth={1.5} aria-hidden />
                      </a>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center pt-0">
              <div
                aria-hidden
                className="mb-2 h-px w-24 bg-gradient-to-r from-transparent via-gold/50 to-transparent md:mb-2.5 md:w-32"
              />
              <Link
                href="#top"
                className="contact-footer-logo contact-footer-logo--hero group inline-flex shrink-0 items-center justify-center"
                aria-label="OD Architects home"
              >
                <Image
                  src={brandLogo}
                  alt="OD Architects"
                  width={720}
                  height={180}
                  className="contact-footer-logo__img h-[4.75rem] w-auto sm:h-[5.5rem] md:h-[6.5rem] lg:h-28"
                  sizes="(max-width: 768px) 280px, 360px"
                  priority={false}
                />
              </Link>
            </div>
          </motion.div>
        </footer>
      </SectionInner>
    </SectionShell>
  );
}
