"use client";

import { RevealChildren } from "@/components/animations/RevealChildren";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { contact, footer } from "@/lib/data";
import { revealInView, softInView } from "@/lib/motion-viewport";
import { motion, useReducedMotion } from "framer-motion";
import { Facebook, Instagram } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

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
    contact.items.find((i) => i.label === "Email")?.value ?? "hello@odstudio.com";
  const [newsletter, setNewsletter] = useState("");

  function onNewsletterSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = newsletter.trim();
    if (!trimmed) return;
    window.location.href = `mailto:${email}?subject=${encodeURIComponent("Newsletter")}&body=${encodeURIComponent(trimmed)}`;
  }

  return (
    <section id="contact" className="relative isolate min-h-[100svh]">
      <div className="absolute inset-0">
        <Image
          src={contact.backgroundImage}
          alt={contact.backgroundAlt}
          fill
          className="object-cover"
          sizes="100vw"
          priority
        />
        <div
          className="absolute inset-0 bg-gradient-to-b from-[#1a120c]/75 via-[#120d09]/55 to-[#0a0705]/88"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_90%_60%_at_50%_0%,rgba(255,248,240,0.08),transparent_55%)]"
          aria-hidden
        />
      </div>

      <RevealChildren
        className="relative z-[1] mx-auto flex min-h-[100svh] max-w-7xl flex-col px-5 pb-8 pt-28 md:px-10 md:pb-10 md:pt-32"
        stagger={0.12}
      >
        <ScrollReveal dramatic className="flex max-w-3xl flex-1 flex-col items-start">
          <p className="font-outfit text-[11px] font-medium uppercase tracking-[0.28em] text-white/65">Start Here</p>
          <h2 className="mt-5 max-w-[18ch] font-display text-[clamp(2.1rem,5.8vw,3.75rem)] font-normal italic leading-[1.06] text-white [text-shadow:0_2px_48px_rgba(0,0,0,0.35)] md:max-w-[22ch]">
            {contact.heading}
          </h2>
          <p className="mt-6 max-w-xl text-sm leading-relaxed text-white/78 md:text-[15px]">{contact.description}</p>
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
                onSubmit={onNewsletterSubmit}
              >
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
                />
                <button
                  type="submit"
                  suppressHydrationWarning
                  className={`${glassPill} shrink-0 px-6 py-2.5 tracking-[0.12em]`}
                >
                  Submit
                </button>
              </form>
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
        </footer>
      </RevealChildren>
    </section>
  );
}
