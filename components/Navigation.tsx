"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Facebook, Instagram, Linkedin } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

const loadEase = [0.22, 1, 0.36, 1] as const;
const softOut = [0.33, 1, 0.68, 1] as const;

const springPanel = { type: "spring", stiffness: 400, damping: 32, mass: 0.88 } as const;

const panelExit = {
  opacity: 0,
  y: 22,
  scale: 0.94,
  rotateX: 5,
  transition: { duration: 0.26, ease: loadEase },
};

const listContainer = {
  hidden: { opacity: 1 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.065, delayChildren: 0.14 },
  },
};

const listItem = {
  hidden: { opacity: 0, x: -22 },
  show: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.42, ease: softOut },
  },
};

const brandRowVariants = {
  hidden: { opacity: 0, y: 12 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: loadEase },
  },
};

const secondaryRowVariants = {
  hidden: { opacity: 0, y: 10 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.36, ease: loadEase, delay: 0.28 },
  },
};

const socialRowVariants = {
  hidden: { opacity: 0, y: 10 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.36, ease: loadEase, delay: 0.36 },
  },
};

const footerRowVariants = {
  hidden: { opacity: 0, y: 8 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.34, ease: loadEase, delay: 0.44 },
  },
};

/** Rounded bar glass (top pill) */
const barGlass =
  "border border-white/[0.14] bg-[rgba(18,18,18,0.36)] shadow-[0_12px_40px_rgba(0,0,0,0.45)] backdrop-blur-[16px] backdrop-saturate-150";

/** Overlay panel */
const menuPanelGlass =
  "border border-white/20 bg-[rgba(18,18,18,0.42)] shadow-[0_32px_100px_rgba(0,0,0,0.65)] backdrop-blur-[20px] backdrop-saturate-150";

const mainLinks = [
  { href: "#top", label: "Home" },
  { href: "#about", label: "About" },
  { href: "#services", label: "Services" },
  { href: "#projects", label: "Journal" },
] as const;

const secondaryLinks = [
  { href: "#contact", label: "Contact" },
  { href: "#footer", label: "Terms" },
  { href: "#footer", label: "Privacy" },
] as const;

const socialLinks = [
  { href: "https://instagram.com", label: "Instagram", Icon: Instagram },
  { href: "https://facebook.com", label: "Facebook", Icon: Facebook },
  { href: "https://linkedin.com", label: "LinkedIn", Icon: Linkedin },
] as const;

export function Navigation() {
  const [open, setOpen] = useState(false);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    if (open) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", onKey);
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const close = () => setOpen(false);
  const toggle = () => setOpen((v) => !v);

  const layerOpen = reduceMotion ? { duration: 0 } : { duration: 0.34, ease: loadEase };
  const layerClose = reduceMotion ? { duration: 0 } : { duration: 0.26, ease: loadEase };

  return (
    <>
      <div className="pointer-events-none fixed inset-x-0 top-[calc(var(--hero-gutter)+var(--hero-nav-offset))] z-[500] flex justify-center px-1 sm:px-0">
        <div className="flex w-full max-w-[min(90vw,420px)] flex-col items-stretch">
          <header
            suppressHydrationWarning
            className={`pointer-events-auto relative z-[560] flex w-full items-center justify-between gap-4 rounded-[14px] px-4 py-2.5 shadow-[0_12px_40px_rgba(0,0,0,0.45)] transition-[transform,opacity,box-shadow] duration-300 ease-[cubic-bezier(0.34,1.3,0.64,1)] md:gap-5 md:rounded-[16px] md:px-5 md:py-3 ${barGlass} ${
              open ? "scale-[0.982] opacity-[0.93]" : "scale-100 opacity-100"
            }`}
          >
            <Link
              href="#top"
              className="font-outfit text-[11px] font-medium uppercase tracking-[0.14em] text-white transition-colors duration-200 hover:text-white md:text-[12px] md:tracking-[0.15em]"
              aria-label="OD Studio home"
            >
              OD STUDIO
            </Link>

            <button
              type="button"
              suppressHydrationWarning
              className="group relative flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-transparent text-white transition-[transform,opacity] duration-300 ease-[cubic-bezier(0.34,1.3,0.64,1)] hover:opacity-90 active:scale-[0.96]"
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              aria-controls="site-menu-dropdown"
              onClick={toggle}
            >
              <span className="relative block h-[9px] w-[18px]" aria-hidden>
                <span
                  className={`absolute left-0 top-0 h-[1.5px] w-[18px] origin-center rounded-full bg-current transition-[transform,opacity] duration-300 ease-[cubic-bezier(0.34,1.3,0.64,1)] ${
                    open ? "translate-y-[3.5px] rotate-45" : "translate-y-0 rotate-0"
                  }`}
                />
                <span
                  className={`absolute left-0 top-[6px] h-[1.5px] w-[18px] origin-center rounded-full bg-current transition-[transform,opacity] duration-300 ease-[cubic-bezier(0.34,1.3,0.64,1)] ${
                    open ? "-translate-y-[3.5px] -rotate-45" : "translate-y-0 rotate-0"
                  }`}
                />
              </span>
            </button>
          </header>

          <AnimatePresence>
            {open && (
              <motion.div
                key="menu-layer"
                className="nav-menu-layer pointer-events-auto fixed inset-0 z-[530] flex flex-col items-center overflow-x-hidden overflow-y-auto px-4 pb-3 pt-[calc(var(--hero-nav-stack)+var(--hero-gutter))] [@media(max-height:720px)]:pb-2 [@media(max-height:720px)]:pt-[calc(var(--hero-nav-stack)+0.35rem)]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, transition: layerOpen }}
                exit={{ opacity: 0, transition: layerClose }}
              >
                <motion.button
                  type="button"
                  suppressHydrationWarning
                  aria-label="Close menu backdrop"
                  className="absolute inset-0 bg-[rgba(6,6,6,0.72)]"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1, transition: reduceMotion ? { duration: 0 } : { duration: 0.38, ease: loadEase } }}
                  exit={{ opacity: 0, transition: reduceMotion ? { duration: 0 } : { duration: 0.22, ease: loadEase } }}
                  onClick={close}
                />

                <div className="relative z-10 flex w-full max-w-full justify-center [perspective:1100px]">
                  <motion.nav
                    id="site-menu-dropdown"
                    role="dialog"
                    aria-modal="true"
                    aria-label="Site menu"
                    className={`relative mt-0 flex w-[min(calc(100vw-1.5rem),400px)] max-w-full shrink-0 flex-col rounded-[20px] px-5 py-4 will-change-transform sm:rounded-[22px] sm:px-7 sm:py-5 md:w-[min(calc(100vw-2rem),420px)] md:px-8 md:py-6 [@media(max-height:720px)]:px-4 [@media(max-height:720px)]:py-3 ${menuPanelGlass}`}
                    style={{ transformOrigin: "50% 0%" }}
                    initial={
                      reduceMotion
                        ? { opacity: 1 }
                        : { opacity: 0, y: 48, scale: 0.88, rotateX: 8 }
                    }
                    animate={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
                    transition={reduceMotion ? { duration: 0 } : springPanel}
                    exit={reduceMotion ? { opacity: 0, transition: { duration: 0.15 } } : panelExit}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <motion.div
                      className="flex shrink-0 justify-center border-b border-white/[0.14] pb-3 sm:pb-4 [@media(max-height:720px)]:pb-2.5"
                      variants={brandRowVariants}
                      initial={reduceMotion ? false : "hidden"}
                      animate={reduceMotion ? false : "show"}
                    >
                      <span className="font-outfit text-[13px] font-semibold uppercase tracking-[0.18em] text-white">
                        OD STUDIO
                      </span>
                    </motion.div>

                    {reduceMotion ? (
                      <ul className="flex flex-col gap-0 border-b border-white/[0.14] py-4 sm:gap-0.5 sm:py-5 [@media(max-height:720px)]:py-3">
                        {mainLinks.map((link) => (
                          <li key={link.href + link.label}>
                            <Link
                              href={link.href}
                              className="block py-1.5 font-outfit text-[1.2rem] font-medium leading-snug tracking-tight text-white transition-[color,transform] duration-200 ease-out hover:translate-x-0.5 hover:text-white/95 sm:py-2 sm:text-[1.35rem] md:text-[1.45rem] [@media(max-height:720px)]:py-1 [@media(max-height:720px)]:text-[1.1rem]"
                              onClick={close}
                            >
                              {link.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <motion.ul
                        className="flex flex-col gap-0 border-b border-white/[0.14] py-4 sm:gap-0.5 sm:py-5 [@media(max-height:720px)]:py-3"
                        variants={listContainer}
                        initial="hidden"
                        animate="show"
                      >
                        {mainLinks.map((link) => (
                          <motion.li key={link.href + link.label} variants={listItem}>
                            <Link
                              href={link.href}
                              className="block py-1.5 font-outfit text-[1.2rem] font-medium leading-snug tracking-tight text-white transition-[color,transform] duration-200 ease-out hover:translate-x-0.5 hover:text-white/95 sm:py-2 sm:text-[1.35rem] md:text-[1.45rem] [@media(max-height:720px)]:py-1 [@media(max-height:720px)]:text-[1.1rem]"
                              onClick={close}
                            >
                              {link.label}
                            </Link>
                          </motion.li>
                        ))}
                      </motion.ul>
                    )}

                    <motion.div
                      className="border-b border-white/[0.14] py-3 sm:py-4 [@media(max-height:720px)]:py-2.5"
                      variants={secondaryRowVariants}
                      initial={reduceMotion ? false : "hidden"}
                      animate={reduceMotion ? false : "show"}
                    >
                      <ul className="flex flex-wrap items-center gap-x-5 gap-y-2">
                        {secondaryLinks.map((link) => (
                          <li key={link.href + link.label}>
                            <Link
                              href={link.href}
                              className="font-outfit text-[13px] font-normal text-white/60 transition-colors duration-200 hover:text-white/90"
                              onClick={close}
                            >
                              {link.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </motion.div>

                    <motion.div
                      className="border-b border-white/[0.14] py-3 sm:py-4 [@media(max-height:720px)]:py-2.5"
                      variants={socialRowVariants}
                      initial={reduceMotion ? false : "hidden"}
                      animate={reduceMotion ? false : "show"}
                    >
                      <div className="flex items-center gap-6 sm:gap-7">
                        {socialLinks.map(({ href, label, Icon }) => (
                          <a
                            key={label}
                            href={href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-white/80 transition-[color,transform] duration-200 hover:scale-105 hover:text-white"
                            aria-label={label}
                          >
                            <Icon className="h-[20px] w-[20px]" strokeWidth={1.45} aria-hidden />
                          </a>
                        ))}
                      </div>
                    </motion.div>

                    <motion.p
                      className="pt-3 font-outfit text-[11px] text-white/35 sm:pt-4 [@media(max-height:720px)]:pt-2"
                      variants={footerRowVariants}
                      initial={reduceMotion ? false : "hidden"}
                      animate={reduceMotion ? false : "show"}
                    >
                      © 2026 OD Studio
                    </motion.p>
                  </motion.nav>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </>
  );
}
