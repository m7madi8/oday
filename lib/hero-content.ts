import type { StaticImageData } from "next/image";
import heroPrimary from "@/imgs/hero/villa-marble-frontal.jpg";
import heroSlide2 from "@/imgs/hero/villa-black-marble.jpg";
import heroSlide3 from "@/imgs/hero/villa-stone-facade.jpg";

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
      alt: "Symmetrical marble villa facade at dusk — hero exterior",
      primary: true,
      objectPosition: "50% 50%",
      objectPositionMobile: "50% 50%",
    },
    {
      src: heroSlide2,
      alt: "Dark marble villa, three-quarter view at dusk — hero exterior",
      primary: false,
      objectPosition: "50% 50%",
      objectPositionMobile: "50% 50%",
    },
    {
      src: heroSlide3,
      alt: "Contemporary stone villa facade with landscaped entrance — hero exterior",
      primary: false,
      objectPosition: "50% 50%",
      objectPositionMobile: "50% 50%",
    },
  ] satisfies ReadonlyArray<{
    src: StaticImageData;
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
