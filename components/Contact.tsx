"use client";

import { RevealChildren } from "@/components/animations/RevealChildren";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { submitContactForm } from "@/lib/contact-form";
import { contact, footer } from "@/lib/content/contact";
import { revealInView, softInView } from "@/lib/motion-viewport";
import { motion, useReducedMotion } from "@/components/ClientMotion";
import { Facebook, Instagram } from "lucide-react";
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

const glassField =
  "min-w-0 flex-1 rounded-xl border border-white/25 bg-white/[0.08] px-4 py-2.5 text-sm text-white placeholder:text-white/45 outline-none backdrop-blur-md transition-[border-color,background-color] duration-300 focus:border-white/45 focus:bg-white/[0.12]";

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
    <SectionShell id="contact" variant="media">
      <div className="absolute inset-0">
        <Image
          src={contact.backgroundImage}
          alt={contact.backgroundAlt}
          fill
          className="object-cover"
          sizes="100vw"
          loading="lazy"
        />
        <div
          className="absolute inset-0 bg-gradient-to-b from-[#121212]/80 via-[#121212]/65 to-[#0a0a0a]/92"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_90%_50%_at_50%_0%,rgba(245,197,24,0.08),transparent_55%)]"
          aria-hidden
        />
      </div>

      <SectionInner className="relative z-[1] flex min-h-[100svh] flex-col pb-[var(--section-pad-bottom)] pt-[var(--hero-nav-stack)]">
      <RevealChildren className="flex flex-1 flex-col" stagger={0.12}>
        <ScrollReveal dramatic className="flex max-w-3xl flex-1 flex-col items-start">
          <SectionHeader
            align="start"
            eyebrow="Start Here"
            title={<span className="text-white">{contact.heading}</span>}
            description={contact.description}
            className="[&_.label-upper]:text-white/65 [&_.section-lead]:text-white/78 [&_.section-title]:max-w-[22ch] [&_.section-title]:text-[clamp(2rem,5vw,3.25rem)] [&_.section-title]:text-white"
          />
          <motion.div
            className="mt-10"
            initial={{ opacity: reduceMotion ? 1 : 0, y: reduceMotion ? 0 : 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={revealInView}
            transition={{ duration: reduceMotion ? 0 : 0.48, delay: reduceMotion ? 0 : 0.12, ease: [0.16, 1, 0.3, 1] }}
          >
            <Link href={`mailto:${email}`} className={glassPill} aria-label={contact.ctaLabel}>
              {contact.ctaLabel}
            </Link>
          </motion.div>
        </ScrollReveal>

        <footer
          id="footer"
          className="relative mt-auto w-full border-t border-white/25 pt-8 md:pt-10"
        >
          <motion.div
            className="flex flex-col gap-10 lg:grid lg:grid-cols-[1fr_auto_1fr] lg:items-end lg:gap-6"
            initial={{ opacity: 1, y: reduceMotion ? 0 : 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={softInView}
            transition={{ duration: reduceMotion ? 0 : 0.5, delay: reduceMotion ? 0 : 0.08 }}
          >
            <div className="flex flex-col gap-4 lg:max-w-xs lg:justify-self-start">
              <p className="text-[12px] leading-relaxed text-white/55 md:text-[13px]">
                {footer.copyright}
              </p>
              <div className="flex gap-3">
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

            <nav
              aria-label="Footer"
              className="flex flex-wrap items-center justify-start gap-x-6 gap-y-2.5 lg:justify-self-center lg:justify-center"
            >
              {footer.bottomBarLinks.map((l) => (
                <Link
                  key={l.href + l.label}
                  href={l.href}
                  className="font-outfit text-[13px] font-normal text-white/85 transition-colors duration-300 hover:text-white"
                >
                  {l.label}
                </Link>
              ))}
            </nav>

            <div className="w-full lg:max-w-sm lg:justify-self-end lg:text-right">
              <p className="font-outfit text-[11px] font-medium uppercase tracking-[0.22em] text-white/50">
                Newsletter
              </p>
              <form
                className="mt-3 flex flex-col gap-2.5 sm:flex-row sm:flex-wrap sm:items-stretch lg:justify-end"
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
                  className={glassField}
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
                <p className="mt-2 text-xs text-red-200/90">{newsletterError}</p>
              ) : newsletterSent ? (
                <p className="mt-2 text-xs text-emerald-100/90">Thanks — you&apos;re on the list.</p>
              ) : null}
            </div>
          </motion.div>

          <div className="mt-8 flex flex-wrap gap-x-8 gap-y-3 border-t border-white/15 pt-6 text-center text-[12px] text-white/50 md:justify-between md:text-left">
            {contact.items.map((item) => (
              <div key={item.label}>
                <p className="font-outfit text-[10px] font-medium uppercase tracking-[0.18em] text-white/40">
                  {item.label}
                </p>
                {item.href ? (
                  <a href={item.href} className="mt-1 block text-white/75 transition-colors hover:text-white">
                    {item.value}
                  </a>
                ) : (
                  <p className="mt-1 text-white/75">{item.value}</p>
                )}
              </div>
            ))}
          </div>

          <motion.div
            className="mt-8 flex flex-col items-center md:mt-9"
            initial={{ opacity: reduceMotion ? 1 : 0, y: reduceMotion ? 0 : 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={softInView}
            transition={{ duration: reduceMotion ? 0 : 0.55, delay: reduceMotion ? 0 : 0.1, ease: [0.16, 1, 0.3, 1] }}
          >
            <div
              aria-hidden
              className="mb-5 h-px w-full max-w-[12rem] bg-gradient-to-r from-transparent via-gold/50 to-transparent md:max-w-[16rem]"
            />
            <Link
              href="#top"
              className="contact-footer-logo group inline-flex shrink-0 items-center justify-center"
              aria-label="OD Studio home"
            >
              <Image
                src={brandLogo}
                alt="OD Studio"
                width={720}
                height={180}
                className="contact-footer-logo__img h-28 w-auto max-w-[min(95vw,720px)] sm:h-32 md:h-[9.5rem] lg:h-40"
                sizes="(max-width: 768px) 640px, 720px"
              />
            </Link>
          </motion.div>
        </footer>
      </RevealChildren>
      </SectionInner>
    </SectionShell>
  );
}
