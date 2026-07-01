import heroVillaCover from "@/imgs/Exterior/Villa/hASSAN SALAMEH 27/ODAY_result.webp";

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
  image: heroVillaCover,
  imageAlt: "Villa 05 — exterior visualization",
  stats: [
    { label: "Projects", value: 500, prefix: "+", suffix: "" },
    { label: "Value", value: 50, prefix: "+", suffix: " million" },
  ],
} as const;
