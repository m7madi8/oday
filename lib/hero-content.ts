import type { StaticImageData } from "next/image";
import heroPrimary from "@/imgs/hero/villa-marble-frontal-4k.jpg";
import heroPrimaryMobile from "@/imgs/hero/villa-marble-frontal-mobile.jpg";
import heroPrimaryTablet from "@/imgs/hero/villa-marble-frontal-tablet.jpg";
import heroSlide2 from "@/imgs/hero/villa-black-marble-4k.jpg";
import heroSlide2Mobile from "@/imgs/hero/villa-black-marble-mobile.jpg";
import heroSlide2Tablet from "@/imgs/hero/villa-black-marble-tablet.jpg";
import heroSlide3 from "@/imgs/hero/villa-entrance-evening-4k.jpg";
import heroSlide3Mobile from "@/imgs/hero/villa-entrance-evening-mobile.jpg";
import heroSlide3Tablet from "@/imgs/hero/villa-entrance-evening-tablet.jpg";
import heroSlide4 from "@/imgs/hero/villa-stone-facade-4k.jpg";
import heroSlide4Mobile from "@/imgs/hero/villa-stone-facade-mobile.jpg";
import heroSlide4Tablet from "@/imgs/hero/villa-stone-facade-tablet.jpg";

/**
 * Full-viewport hero stills are 16:9 (or wider) and covered onto portrait
 * screens by HEIGHT. `sizes="100vw"` fetches by WIDTH, so a 3x phone would
 * otherwise get a ~1200px landscape file and upscale it 3–4×.
 *
 * Device crops keep the native 4K height at the target aspect so a width-based
 * srcset still has enough vertical pixels.
 */
export const HERO_MOBILE_MEDIA = "(orientation: portrait) and (max-width: 767px)";
export const HERO_TABLET_MEDIA = "(orientation: portrait) and (min-width: 768px) and (max-width: 1366px)";
export const HERO_MOBILE_SIZES = "100vw";
export const HERO_TABLET_SIZES = "100vw";
export const HERO_DESKTOP_SIZES = "100vw";

/** Homepage hero copy — kept separate from data.ts to avoid heavy module init cycles. */
export const hero = {
  headlineEyebrow: "Architecture · Engineering · Delivery",
  headlineBeforeAccent: "We Design For",
  headlineAccent: "A Better Life",
  headlineSubline:
    "Engineering discipline and design authority — built to elevate assets, environments, and the lives within them.",
  ctaEyebrow: "Case Studies",
  ctaLabel: "View All Projects",
  ctaHref: "/#services",
  titleLine1: "Design",
  titleLine2Words: ["That", "Drives", "Value"],
  description:
    "Exterior Design, Interior Design, Ai architect, and Architect Dron — precision-focused delivery for high-value projects.",
  /** Primary holds longer; secondary slides rotate a bit faster */
  primaryIntervalMs: 8000,
  slideIntervalMs: 6000,
  images: [
    {
      src: heroPrimary,
      srcMobile: heroPrimaryMobile,
      srcTablet: heroPrimaryTablet,
      alt: "Symmetrical marble villa facade at dusk — hero exterior",
      primary: true,
      objectPosition: "50% 50%",
      objectPositionMobile: "50% 50%",
    },
    {
      src: heroSlide2,
      srcMobile: heroSlide2Mobile,
      srcTablet: heroSlide2Tablet,
      alt: "Dark marble villa, three-quarter view at dusk — hero exterior",
      primary: false,
      objectPosition: "50% 50%",
      objectPositionMobile: "50% 50%",
    },
    {
      src: heroSlide3,
      srcMobile: heroSlide3Mobile,
      srcTablet: heroSlide3Tablet,
      alt: "Luxury villa entrance at dusk with landscaped driveway — hero exterior",
      primary: false,
      objectPosition: "50% 50%",
      objectPositionMobile: "50% 50%",
    },
    {
      src: heroSlide4,
      srcMobile: heroSlide4Mobile,
      srcTablet: heroSlide4Tablet,
      alt: "Contemporary stone villa facade with landscaped entrance — hero exterior",
      primary: false,
      objectPosition: "50% 50%",
      objectPositionMobile: "50% 50%",
    },
  ] satisfies ReadonlyArray<{
    src: StaticImageData;
    srcMobile: StaticImageData;
    srcTablet: StaticImageData;
    alt: string;
    primary: boolean;
    objectPosition: string;
    objectPositionMobile: string;
  }>,
  image: heroPrimary,
  imageAlt: "Symmetrical marble villa facade at dusk — hero exterior",
  stats: [
    { label: "Projects", value: 500, prefix: "+", suffix: "" },
    { label: "Value", value: 50, prefix: "+", suffix: "M" },
  ],
} as const;
