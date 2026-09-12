"use client";

import { submitContactForm } from "@/lib/contact-form";
import { about as studioAbout } from "@/lib/content/about";
import { contact, footer } from "@/lib/content/contact";
import { StudioStats } from "@/components/StudioStats";
import { Facebook, Instagram } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const socialIcons = {
  facebook: Facebook,
  instagram: Instagram,
} as const;

const fieldLabel =
  "font-ui text-xs font-medium uppercase tracking-widest text-gold/70";
const fieldValue =
  "mt-3 block font-display text-lg font-light leading-snug text-white md:text-xl";
const focusRing =
  "outline-none transition-colors duration-300 focus-visible:text-gold focus-visible:underline focus-visible:decoration-gold/70 focus-visible:underline-offset-4";

export function Contact() {
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
    <section
      id="contact"
      className="relative overflow-visible border-t border-white/10 bg-[#0A0A0A] pb-8 pt-16 scroll-mt-20 md:pb-10 md:pt-24"
    >
      <div className="mx-auto w-full max-w-7xl px-6 md:px-8 lg:px-10">
        <header className="mb-16 grid grid-cols-1 items-center gap-10 md:mb-20 md:grid-cols-[minmax(16rem,22rem)_auto_minmax(0,1fr)] md:gap-10 lg:gap-14">
          <figure className="relative m-0 mx-auto w-full max-w-[20rem] border border-white/10 p-3 md:mx-0 md:max-w-none md:p-4">
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

          <span className="hidden h-36 w-px bg-gold/35 md:block" aria-hidden />

          <div className="max-w-xl text-center md:text-left">
            <p className={fieldLabel}>The Studio</p>
            <h2 className="mt-4 font-display text-3xl font-light italic tracking-tight text-white md:text-5xl">
              {studioAbout.directorName}
            </h2>
            <span className="mx-auto mt-5 block h-px w-12 bg-gold/50 md:mx-0" aria-hidden />
            <p className="mt-5 font-ui text-xs font-medium uppercase tracking-widest text-white/55">
              {studioAbout.directorRole}
            </p>
            <p className="mt-4 text-sm font-light leading-relaxed text-white/45 md:text-base">
              {studioAbout.studioTagline}
            </p>
            <StudioStats />
          </div>
        </header>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-12 lg:grid-cols-4">
          {contact.items.map((item) => (
            <div key={item.label} className="min-w-0">
              <p className={fieldLabel}>{item.label}</p>
              {item.href ? (
                <a
                  href={item.href}
                  className={`${fieldValue} ${focusRing} hover:text-gold`}
                  {...(item.label === "Location"
                    ? { target: "_blank", rel: "noopener noreferrer" }
                    : {})}
                >
                  <span
                    className={
                      item.label === "Email"
                        ? "break-all sm:break-normal lg:whitespace-nowrap"
                        : undefined
                    }
                  >
                    {item.value}
                  </span>
                </a>
              ) : (
                <p className={fieldValue}>{item.value}</p>
              )}
            </div>
          ))}

          <div className="min-w-0 lg:max-w-sm">
            <p className={fieldLabel}>Newsletter</p>
            <label htmlFor="footer-newsletter-email" className={fieldValue}>
              Stay Updated
            </label>

            <form
              className="relative mt-4 flex flex-col gap-4"
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

              <div>
                <input
                  id="footer-newsletter-email"
                  type="email"
                  name="email"
                  autoComplete="email"
                  placeholder="name@studio.com"
                  required
                  value={newsletter}
                  onChange={(e) => setNewsletter(e.target.value)}
                  disabled={newsletterSubmitting || newsletterSent}
                  suppressHydrationWarning
                  className="h-9 w-full border-0 border-b border-white/20 bg-transparent px-0 text-sm font-light text-white placeholder:text-white/30 outline-none transition-colors duration-300 focus:border-gold focus-visible:border-gold disabled:opacity-50"
                />
              </div>

              <div>
                <button
                  type="submit"
                  disabled={newsletterSubmitting || newsletterSent}
                  className="btn btn--primary btn--sm"
                >
                  {newsletterSubmitting ? "Sending…" : newsletterSent ? "Subscribed" : "Submit"}
                </button>
              </div>

              {newsletterError ? (
                <p className="text-xs text-red-300/90" role="alert">
                  {newsletterError}
                </p>
              ) : newsletterSent ? (
                <p className="text-xs text-white/55" aria-live="polite">
                  Thanks — you&apos;re on the list.
                </p>
              ) : null}
            </form>
          </div>
        </div>

        <footer id="footer" className="mt-16 border-t border-white/10 pt-8 md:mt-20">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <nav aria-label="Footer" className="flex flex-wrap items-center gap-x-8 gap-y-3">
              {footer.bottomBarLinks.map((link) => (
                <Link
                  key={link.href + link.label}
                  href={link.href}
                  className={`font-ui text-xs font-normal uppercase tracking-widest text-white/55 hover:text-gold ${focusRing}`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:gap-8">
              <p className="text-xs font-light text-white/40">{footer.copyright}</p>
              <div className="flex items-center gap-3">
                {footer.social.map((social) => {
                  const Icon = socialIcons[social.icon];
                  return (
                    <a
                      key={social.label}
                      href={social.href}
                      aria-label={social.label}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 text-white/70 outline-none transition-colors duration-300 hover:border-gold hover:bg-gold/10 hover:text-gold focus-visible:border-gold focus-visible:bg-gold/10 focus-visible:text-gold"
                    >
                      <Icon className="h-4 w-4" strokeWidth={1.5} aria-hidden />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>
        </footer>
      </div>
    </section>
  );
}
