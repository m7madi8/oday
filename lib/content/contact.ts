import exteriorImage from "@/imgs/exterior.jpg";

export interface ContactChannel {
  label: string;
  value: string;
  href?: string;
}

export const contact = {
  heading: "Ready to Position Your Next Landmark?",
  description:
    "Share your goals and timeline. We will return with a strategic direction, scope model, and execution path.",
  ctaLabel: "Book Discovery Call",
  backgroundImage: exteriorImage,
  backgroundAlt: "Contemporary exterior architecture in Ramallah",
  items: [
    {
      label: "Location",
      value: "Al-Bireh, Ramallah",
      href: "https://www.google.com/maps/search/?api=1&query=31.9230623,35.2090546",
    },
    {
      label: "Email",
      value: "eslamhuhu1@gmail.com",
      href: "mailto:eslamhuhu1@gmail.com",
    },
    {
      label: "Phone",
      value: "+972 56-812-3413",
      href: "tel:+972568123413",
    },
  ] satisfies ContactChannel[],
};

export const footer = {
  blurb:
    "OD Studio transforms complex briefs into high-value assets through design intelligence and engineering rigor.",
  bottomBarLinks: [
    { href: "#top", label: "Home" },
    { href: "#about", label: "About" },
    { href: "#services", label: "Services" },
    { href: "/projects", label: "Gallery" },
    { href: "#contact", label: "Contact" },
  ] as const,
  homepageLinks: [
    { href: "#about", label: "Studio" },
    { href: "/projects", label: "Case Studies" },
    { href: "#services", label: "Solutions" },
    { href: "#contact", label: "Contact" },
  ],
  categoryLinks: [
    { href: "/projects?service=exterior", label: "Exterior Design" },
    { href: "/projects?service=interior", label: "Interior Design" },
    { href: "/projects?service=architecture-ai", label: "Ai Design" },
    { href: "/projects?service=architecture-drone", label: "Architect Dron" },
  ],
  social: [
    { label: "Facebook", href: "https://facebook.com", icon: "facebook" as const },
    { label: "Instagram", href: "https://instagram.com", icon: "instagram" as const },
  ],
  copyright: "© 2026 OD Studio. All rights reserved.",
};
