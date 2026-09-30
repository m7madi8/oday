import type { StaticImageData } from "next/image";
import heroPrimary from "@/imgs/hero/villa-marble-frontal-ultrawide-4k.webp";
import heroPrimaryMobile from "@/imgs/hero/villa-marble-frontal-mobile.webp";
import heroPrimaryTablet from "@/imgs/hero/villa-marble-frontal-tablet.webp";
import heroSlide2 from "@/imgs/hero/villa-black-marble-ultrawide-4k.webp";
import heroSlide2Mobile from "@/imgs/hero/villa-black-marble-mobile.webp";
import heroSlide2Tablet from "@/imgs/hero/villa-black-marble-tablet.webp";
import heroSlide3 from "@/imgs/hero/villa-entrance-evening-4k.webp";
import heroSlide3Mobile from "@/imgs/hero/villa-entrance-evening-mobile.webp";
import heroSlide3Tablet from "@/imgs/hero/villa-entrance-evening-tablet.webp";
import heroSlide4 from "@/imgs/hero/villa-stone-facade-ultrawide-4k.webp";
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
export const HERO_LCP_QUALITY = 92;
export const HERO_CAROUSEL_QUALITY = 90;
/** @deprecated Use HERO_LCP_QUALITY / HERO_CAROUSEL_QUALITY */
export const HERO_IMAGE_QUALITY = HERO_CAROUSEL_QUALITY;

export const HERO_MOBILE_SIZES = "(max-width: 767px) 100vw";
export const HERO_TABLET_SIZES = "(max-width: 1024px) 100vw, 960px";
export const HERO_DESKTOP_SIZES = "(max-width: 1536px) 100vw, 1920px";
/** First still only — allows crisp 4K/ultrawide without enlarging carousel payloads. */
export const HERO_LCP_DESKTOP_SIZES = "(max-width: 1536px) 100vw, 2560px";

const heroImages = [
  {
    src: heroPrimary,
    srcMobile: heroPrimaryMobile,
    srcTablet: heroPrimaryTablet,
    alt: "Symmetrical marble villa facade at dusk — hero exterior",
    primary: true,
    objectPosition: "50% 50%",
  },
  {
    src: heroSlide2,
    srcMobile: heroSlide2Mobile,
    srcTablet: heroSlide2Tablet,
    alt: "Dark marble villa, three-quarter view at dusk — hero exterior",
    primary: false,
    objectPosition: "50% 50%",
  },
  {
    src: heroSlide3,
    srcMobile: heroSlide3Mobile,
    srcTablet: heroSlide3Tablet,
    alt: "Luxury villa entrance at dusk with landscaped driveway — hero exterior",
    primary: false,
    objectPosition: "50% 50%",
  },
  {
    src: heroSlide4,
    srcMobile: heroSlide4Mobile,
    srcTablet: heroSlide4Tablet,
    alt: "Contemporary stone villa facade with landscaped entrance — hero exterior",
    primary: false,
    objectPosition: "50% 50%",
  },
] satisfies ReadonlyArray<{
  src: StaticImageData;
  srcMobile: StaticImageData;
  srcTablet: StaticImageData;
  alt: string;
  primary: boolean;
  objectPosition: string;
}>;

export const hero = {
  ...heroCopy,
  images: heroImages,
  image: heroPrimary,
  imageAlt: "Symmetrical marble villa facade at dusk — hero exterior",
} as const;
