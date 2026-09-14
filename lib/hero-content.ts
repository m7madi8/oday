import type { StaticImageData } from "next/image";
import heroPrimary from "@/imgs/hero/villa-hero.jpg";
import heroSlide2 from "@/imgs/hero/villa-marble.jpg";
import heroSlide3 from "@/imgs/hero/villa-facade.jpg";
import heroSlide4 from "@/imgs/hero/villa-entrance.jpg";

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
      alt: "Contemporary villa exterior — hero",
      primary: true,
      objectPosition: "50% 18%",
      objectPositionMobile: "50% 14%",
    },
    {
      src: heroSlide2,
      alt: "Dark marble villa — hero exterior",
      primary: false,
      objectPosition: "50% 20%",
      objectPositionMobile: "50% 16%",
    },
    {
      src: heroSlide3,
      alt: "Contemporary villa facade — hero exterior",
      primary: false,
      objectPosition: "50% 62%",
      objectPositionMobile: "50% 58%",
    },
    {
      src: heroSlide4,
      alt: "Villa entrance at dusk — hero exterior",
      primary: false,
      objectPosition: "50% 52%",
      objectPositionMobile: "50% 48%",
    },
  ] satisfies ReadonlyArray<{
    src: StaticImageData;
    alt: string;
    primary: boolean;
    objectPosition: string;
    objectPositionMobile: string;
  }>,
  image: heroPrimary,
  imageAlt: "Contemporary villa exterior — hero",
  stats: [
    { label: "Projects", value: 500, prefix: "+", suffix: "" },
    { label: "Value", value: 50, prefix: "+", suffix: "M" },
  ],
} as const;
