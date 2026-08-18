import type { StaticImageData } from "next/image";
import heroPrimary from "@/imgs/Exterior/Villa/villa 12 bh/ODAY_result.webp";
import heroSlide2 from "@/imgs/Exterior/Villa/villa 10 viv/ODAY_result.webp";
import heroSlide3 from "@/imgs/Exterior/Villa/nasim shawahneh 42/oday_result.webp";

/** Homepage hero copy — kept separate from data.ts to avoid heavy module init cycles. */
export const hero = {
  headlineEyebrow: "Architecture · Engineering · Delivery",
  headlineBeforeAccent: "We Design For ",
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
      alt: "B.H Villa — primary hero exterior",
      primary: true,
      objectPosition: "52% 36%",
      objectPositionMobile: "60% 40%",
    },
    {
      src: heroSlide2,
      alt: "V I V villa — hero exterior",
      primary: false,
      objectPosition: "44% 42%",
      objectPositionMobile: "38% 48%",
    },
    {
      src: heroSlide3,
      alt: "420 I Villa — hero exterior",
      primary: false,
      objectPosition: "54% 36%",
      objectPositionMobile: "58% 38%",
    },
  ] satisfies ReadonlyArray<{
    src: StaticImageData;
    alt: string;
    primary: boolean;
    objectPosition: string;
    objectPositionMobile: string;
  }>,
  image: heroPrimary,
  imageAlt: "B.H Villa — primary hero exterior",
  stats: [
    { label: "Projects", value: 500, prefix: "+", suffix: "" },
    { label: "Value", value: 50, prefix: "+", suffix: " million" },
  ],
} as const;
