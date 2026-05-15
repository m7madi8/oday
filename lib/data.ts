import type { LucideIcon } from "lucide-react";
import type { StaticImageData } from "next/image";
import {
  Compass,
  DraftingCompass,
  Globe2,
  Layers3,
  Box,
  MapPinned,
  MonitorPlay,
} from "lucide-react";
import aboutImage from "@/imgs/about.jpg";
import exteriorImage from "@/imgs/exterior.jpg";
import interiorImage from "@/imgs/interior.jpg";

export const site = {
  name: "OD Studio",
  tagline:
    "Architecture and engineering that increase asset value, brand prestige, and investor confidence.",
};

export const navLinks = [
  { href: "#about", label: "Studio" },
  { href: "#services", label: "Solutions" },
  { href: "#projects", label: "Case Studies" },
  { href: "#process", label: "Execution" },
  { href: "#faq", label: "FAQ" },
  { href: "#contact", label: "Contact" },
] as const;

export type ProjectCategory = "Residential" | "Cultural";

export const projectFilters = ["All", "Residential", "Cultural"] as const;
export type ProjectFilter = (typeof projectFilters)[number];

export interface Project {
  id: string;
  orderLabel: string;
  title: string;
  country: string;
  tag: string;
  category: ProjectCategory;
  image: string | StaticImageData;
  imageAlt: string;
}

export const projects: Project[] = [
  {
    id: "p1",
    orderLabel: "01",
    title: "Palm Crown Residence",
    country: "Nablus, Palestine",
    tag: "Ultra-Luxury Residence",
    category: "Residential",
    image: interiorImage,
    imageAlt: "Luxury interior lounge with sculpted ceiling details",
  },
  {
    id: "p3",
    orderLabel: "02",
    title: "Seafront Culture House",
    country: "Bethlehem, Palestine",
    tag: "Cultural Destination",
    category: "Cultural",
    image: interiorImage,
    imageAlt: "Premium interior environment with warm lighting",
  },
  {
    id: "p5",
    orderLabel: "03",
    title: "Crescent Museum Annex",
    country: "Ramallah, Palestine",
    tag: "Cultural Expansion",
    category: "Cultural",
    image: interiorImage,
    imageAlt: "Interior spatial composition for cultural experience",
  },
  {
    id: "p6",
    orderLabel: "04",
    title: "Cliffline Signature Villas",
    country: "Nablus, Palestine",
    tag: "Residential Collection",
    category: "Residential",
    image: aboutImage,
    imageAlt: "Architectural landscaping with modern villa context",
  },
];

export const hero = {
  titleLine1: "Design",
  titleLine2Words: ["That", "Drives", "Value"],
  description:
    "Interior, landscape, exterior, architecture drone, and architecture AI — precision-focused delivery for high-value projects.",
  image:
    "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1920&q=80",
  imageAlt: "Modern desert villa at sunset with infinity pool and mountain backdrop",
  stats: [
    { label: "Projects", value: 180, suffix: "+" },
    { label: "Years", value: 8, suffix: "" },
    { label: "Markets", value: 42, suffix: "" },
    { label: "Repeat Clients", value: 91, suffix: "%" },
  ],
};

export interface Strength {
  title: string;
  description: string;
  icon: LucideIcon;
}

export const about = {
  sectionNumber: "01",
  heading: "Built for Serious Developers",
  intro:
    "OD Studio integrates architecture, interiors, and technical engineering in one accountable team built for premium real-estate outcomes.",
  logoWordmark: "OD",
  logoSub: "STUDIO",
  strengths: [
    {
      title: "Design Strategy",
      description:
        "Every concept starts with spatial intent, material identity, and buildable clarity.",
      icon: Layers3,
    },
    {
      title: "Technical Authority",
      description:
        "BIM-led coordination, code compliance, and buildable detailing reduce execution risk.",
      icon: Compass,
    },
    {
      title: "Execution Control",
      description:
        "Clear milestones, transparent reporting, and site follow-up protect quality and timeline.",
      icon: Globe2,
    },
  ] satisfies Strength[],
  directorName: "Oday Abu Doha",
  directorRole: "Founder & Design Director",
  image:
    "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1000&q=80",
  imageAlt: "Modern architectural courtyard with water feature and landscaped garden",
};

export interface ServiceItem {
  id: string;
  orderLabel: string;
  title: string;
  description: string;
  icon: LucideIcon;
}

export const services: ServiceItem[] = [
  {
    id: "s1",
    orderLabel: "01",
    title: "Interior",
    description:
      "Premium interior planning, material systems, and execution-ready detailing.",
    icon: Box,
  },
  {
    id: "s2",
    orderLabel: "02",
    title: "Landscape",
    description:
      "Landscape concept design, hardscape strategy, and outdoor spatial identity.",
    icon: MapPinned,
  },
  {
    id: "s3",
    orderLabel: "03",
    title: "Exterior",
    description:
      "Facade language, massing refinement, and exterior performance optimization.",
    icon: DraftingCompass,
  },
  {
    id: "s4",
    orderLabel: "04",
    title: "Architecture Drone",
    description:
      "Aerial capture, site intelligence, and progress tracking for smarter decisions.",
    icon: MonitorPlay,
  },
  {
    id: "s5",
    orderLabel: "05",
    title: "Architecture AI",
    description:
      "AI-assisted concept exploration, optimization, and performance-led design workflows.",
    icon: Layers3,
  },
];

export interface ProcessStep {
  step: string;
  title: string;
  description: string;
}

export const processSteps: ProcessStep[] = [
  {
    step: "01",
    title: "Align",
    description:
      "Project goals, lifestyle profile, and site constraints are defined in one strategic brief.",
  },
  {
    step: "02",
    title: "Design",
    description:
      "Spatial concepts and performance targets are shaped through rapid decision loops.",
  },
  {
    step: "03",
    title: "Engineer",
    description:
      "Technical packages are coordinated across architecture, structure, and MEP.",
  },
  {
    step: "04",
    title: "Deliver",
    description:
      "Site oversight and QA/QC secure design intent from mobilization to handover.",
  },
];

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export const faqItems: FaqItem[] = [
  {
    id: "faq1",
    question: "What project types are the best fit for your team?",
    answer:
      "Luxury residences and villas, cultural destinations, and landscape-led estates where interior, exterior, and outdoor design quality are critical.",
  },
  {
    id: "faq2",
    question: "How fast can we move from brief to concept?",
    answer:
      "Most concept phases run within 4-8 weeks, followed by structured technical delivery according to scope and authority requirements.",
  },
  {
    id: "faq3",
    question: "How do you control budget and quality together?",
    answer:
      "Through stage-gated approvals, BIM coordination, and weekly QA/QC reviews that lock quality while managing change early.",
  },
  {
    id: "faq4",
    question: "Can you support investor or sales presentations?",
    answer:
      "Yes. We prepare high-impact visual and strategic presentation assets for investors, boards, and pre-sales teams.",
  },
];

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  quote: string;
  image: string;
  imageAlt: string;
}

export const testimonials: Testimonial[] = [
  {
    id: "t1",
    name: "Nora Al-Mansoori",
    role: "CEO, Meridian Developments",
    quote:
      "OD Studio reframed our project as a premium market product, and the positioning impact was immediate.",
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80",
    imageAlt: "Portrait of Elena Marchetti",
  },
  {
    id: "t2",
    name: "Adam Farouk",
    role: "Managing Partner, Axis Properties",
    quote:
      "Their technical discipline saved months in coordination while keeping the design intent exactly where it needed to be.",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80",
    imageAlt: "Portrait of James Okonkwo",
  },
  {
    id: "t3",
    name: "Leila Haddad",
    role: "Director, Atelier Hospitality Group",
    quote:
      "From concept to launch assets, they gave us a brand-level design story that directly improved client confidence.",
    image:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80",
    imageAlt: "Portrait of Sofia Lindqvist",
  },
];

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
      value: "Ramallah, Palestine",
    },
    {
      label: "Email",
      value: "hello@odstudio.com",
      href: "mailto:hello@odstudio.com",
    },
    {
      label: "Phone",
      value: "+970 0000000",
      href: "tel:+9700000000",
    },
  ] satisfies ContactChannel[],
};

export const footer = {
  blurb:
    "OD Studio transforms complex briefs into high-value assets through design intelligence and engineering rigor.",
  /** Single-row footer strip (aligned with main navigation). */
  bottomBarLinks: [
    { href: "#top", label: "Home" },
    { href: "#about", label: "About" },
    { href: "#services", label: "Services" },
    { href: "#projects", label: "Journal" },
    { href: "#contact", label: "Contact" },
  ] as const,
  homepageLinks: [
    { href: "#about", label: "Studio" },
    { href: "#projects", label: "Case Studies" },
    { href: "#services", label: "Solutions" },
    { href: "#contact", label: "Contact" },
  ],
  categoryLinks: [
    { href: "#services", label: "Interior" },
    { href: "#services", label: "Landscape" },
    { href: "#services", label: "Exterior" },
    { href: "#services", label: "Architecture Drone" },
    { href: "#services", label: "Architecture AI" },
  ],
  social: [
    { label: "Facebook", href: "https://facebook.com", icon: "facebook" as const },
    { label: "Instagram", href: "https://instagram.com", icon: "instagram" as const },
  ],
  copyright: "© 2026 OD Studio. All rights reserved.",
};
