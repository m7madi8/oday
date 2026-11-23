import type { StaticImageData } from "next/image";
import heroPrimary from "@/imgs/hero/hero-lcp-primary.png";
import heroPrimaryMobile from "@/imgs/hero/hero-lcp-primary.png";
import heroPrimaryTablet from "@/imgs/hero/hero-lcp-primary.png";
import heroSlide2 from "@/imgs/hero/modern-charcoal-stone-house-at-twilight.png";
import heroSlide2Mobile from "@/imgs/hero/villa-black-marble-mobile.webp";
import heroSlide2Tablet from "@/imgs/hero/villa-black-marble-tablet.webp";
import heroSlide3 from "@/imgs/hero/twilight-luxury-residence-with-scooter.png";
import heroSlide3Mobile from "@/imgs/hero/villa-entrance-evening-mobile.webp";
import heroSlide3Tablet from "@/imgs/hero/villa-entrance-evening-tablet.webp";
import heroSlide4 from "@/imgs/hero/twilight-luxury-residence-with-scooter.png";
import heroSlide4Mobile from "@/imgs/hero/villa-stone-facade-mobile.webp";
import heroSlide4Tablet from "@/imgs/hero/villa-stone-facade-tablet.webp";
import { heroCopy } from "@/lib/hero-copy";

export const HERO_MOBILE_MEDIA = "(orientation: portrait) and (max-width: 767px)";
export const HERO_TABLET_MEDIA =
  "(orientation: portrait) and (min-width: 768px) and (max-width: 1536px)";
export const HERO_DESKTOP_MEDIA = "(min-width: 1280px), (orientation: landscape) and (min-width: 768px)";

/**
 * Hero image delivery — max visual quality without oversized downloads:
 * - Slide 1: highest encoder quality + preload (AVIF/WebP at `sizes` width only).
 * - Slides 2–4: still sharp, loaded lazily after first paint.
 */
export const HERO_LCP_QUALITY = 100;
/** Hero still — serve the public PNG/JPEG as-is (no AVIF/WebP re-encode). */
export const HERO_LCP_UNOPTIMIZED = true;
export const HERO_CAROUSEL_QUALITY = 90;
/** @deprecated Use HERO_LCP_QUALITY / HERO_CAROUSEL_QUALITY */
export const HERO_IMAGE_QUALITY = HERO_CAROUSEL_QUALITY;

export const HERO_MOBILE_SIZES = "(max-width: 767px) 100vw";
export const HERO_TABLET_SIZES = "(max-width: 1024px) 100vw, 960px";
export const HERO_DESKTOP_SIZES = "(max-width: 1536px) 100vw, 1920px";
/** Public hero still (byte-identical to source file — no Next image pipeline). */
export const HERO_LCP_PUBLIC_SRC = "/hero/hero-lcp.png";
export const HERO_LCP_INTRINSIC_WIDTH = 1915;
export const HERO_LCP_INTRINSIC_HEIGHT = 821;
/** Native hero still width — avoid requesting upscaled derivatives. */
export const HERO_LCP_DESKTOP_SIZES = "1915px";

const heroImages = [
  {
    src: heroPrimary,
    srcMobile: heroPrimaryMobile,
    srcTablet: heroPrimaryTablet,
    publicSrc: HERO_LCP_PUBLIC_SRC,
    intrinsicWidth: HERO_LCP_INTRINSIC_WIDTH,
    intrinsicHeight: HERO_LCP_INTRINSIC_HEIGHT,
    alt: "Contemporary villa facade at dusk — hero exterior",
    primary: true,
    objectPosition: "50% 50%",
  },
  {
    src: heroSlide2,
    srcMobile: heroSlide2Mobile,
    srcTablet: heroSlide2Tablet,
    publicSrc: "/hero/hero-slide-2.png",
    intrinsicWidth: 1926,
    intrinsicHeight: 817,
    alt: "Dark marble villa, three-quarter view at dusk — hero exterior",
    primary: false,
    objectPosition: "50% 50%",
  },
  {
    src: heroSlide3,
    srcMobile: heroSlide3Mobile,
    srcTablet: heroSlide3Tablet,
    publicSrc: "/hero/hero-slide-3.png",
    intrinsicWidth: 1926,
    intrinsicHeight: 817,
    alt: "Luxury villa entrance at dusk with landscaped driveway — hero exterior",
    primary: false,
    objectPosition: "50% 50%",
  },
  {
    src: heroSlide4,
    srcMobile: heroSlide4Mobile,
    srcTablet: heroSlide4Tablet,
    publicSrc: "/hero/hero-slide-4.png",
    intrinsicWidth: 1926,
    intrinsicHeight: 817,
    alt: "Twilight luxury residence with scooter at dusk — hero exterior",
    primary: false,
    objectPosition: "50% 50%",
  },
] satisfies ReadonlyArray<{
  src: StaticImageData;
  srcMobile: StaticImageData;
  srcTablet: StaticImageData;
  publicSrc: string;
  intrinsicWidth: number;
  intrinsicHeight: number;
  alt: string;
  primary: boolean;
  objectPosition: string;
}>;

export const hero = {
  ...heroCopy,
  images: heroImages,
  image: heroPrimary,
  imageAlt: "Contemporary villa facade at dusk — hero exterior",
} as const;
