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
import ceoPortrait from "@/imgs/ceo.jpg";
import exteriorImage from "@/imgs/exterior.jpg";
import interiorImage from "@/imgs/interior.jpg";
import landscapeImage from "@/imgs/landscape.jpg";

export const site = {
  name: "OD Studio",
  tagline:
    "Architecture and engineering that increase asset value, brand prestige, and investor confidence.",
};

export const navLinks = [
  { href: "#about", label: "Studio" },
  { href: "#services", label: "Solutions" },
  { href: "/projects", label: "Case Studies" },
  { href: "#process", label: "Execution" },
  { href: "#faq", label: "FAQ" },
  { href: "#contact", label: "Contact" },
] as const;

export type ProjectCategory = "Residential" | "Cultural";

export const serviceSlugs = [
  "interior",
  "landscape",
  "exterior",
  "architecture-drone",
  "architecture-ai",
] as const;

export type ServiceSlug = (typeof serviceSlugs)[number];

export const projectServiceFilters = ["All", ...serviceSlugs] as const;
export type ProjectServiceFilter = (typeof projectServiceFilters)[number];

/** @deprecated Use projectServiceFilters for gallery filtering */
export const projectFilters = projectServiceFilters;
export type ProjectFilter = ProjectServiceFilter;

export interface Project {
  id: string;
  orderLabel: string;
  title: string;
  country: string;
  tag: string;
  category: ProjectCategory;
  serviceSlug: ServiceSlug;
  image: string | StaticImageData;
  imageAlt: string;
}

export const projects: Project[] = [
  // Interior (5)
  {
    id: "in-1",
    orderLabel: "01",
    title: "Palm Crown Residence",
    country: "Nablus, Palestine",
    tag: "Ultra-Luxury Residence",
    category: "Residential",
    serviceSlug: "interior",
    image: interiorImage,
    imageAlt: "Luxury interior lounge with sculpted ceiling details",
  },
  {
    id: "in-2",
    orderLabel: "02",
    title: "Velvet Atrium Lobby",
    country: "Ramallah, Palestine",
    tag: "Hospitality Interior",
    category: "Cultural",
    serviceSlug: "interior",
    image: aboutImage,
    imageAlt: "Grand lobby with double-height glazing and stone floors",
  },
  {
    id: "in-3",
    orderLabel: "03",
    title: "Lunar Spa Suites",
    country: "Bethlehem, Palestine",
    tag: "Wellness Interior",
    category: "Residential",
    serviceSlug: "interior",
    image: exteriorImage,
    imageAlt: "Spa suite interior with warm minimal lighting",
  },
  {
    id: "in-4",
    orderLabel: "04",
    title: "Boardroom One",
    country: "Ramallah, Palestine",
    tag: "Executive Workspace",
    category: "Cultural",
    serviceSlug: "interior",
    image: interiorImage,
    imageAlt: "Executive boardroom with tailored joinery",
  },
  {
    id: "in-5",
    orderLabel: "05",
    title: "Marble Gallery Kitchen",
    country: "Jericho, Palestine",
    tag: "Residential Kitchen",
    category: "Residential",
    serviceSlug: "interior",
    image: aboutImage,
    imageAlt: "Open kitchen with marble island and pendant lighting",
  },
  // Landscape (5)
  {
    id: "ls-1",
    orderLabel: "01",
    title: "Cliffline Signature Villas",
    country: "Nablus, Palestine",
    tag: "Residential Collection",
    category: "Residential",
    serviceSlug: "landscape",
    image: aboutImage,
    imageAlt: "Architectural landscaping with modern villa context",
  },
  {
    id: "ls-2",
    orderLabel: "02",
    title: "Olive Grove Courtyard",
    country: "Ramallah, Palestine",
    tag: "Courtyard Garden",
    category: "Cultural",
    serviceSlug: "landscape",
    image: interiorImage,
    imageAlt: "Courtyard garden with olive trees and stone paving",
  },
  {
    id: "ls-3",
    orderLabel: "03",
    title: "Linear Reflecting Pools",
    country: "Bethlehem, Palestine",
    tag: "Water Feature",
    category: "Residential",
    serviceSlug: "landscape",
    image: exteriorImage,
    imageAlt: "Reflecting pool alongside contemporary architecture",
  },
  {
    id: "ls-4",
    orderLabel: "04",
    title: "Terraced Hillside Estate",
    country: "Nablus, Palestine",
    tag: "Terraced Landscape",
    category: "Residential",
    serviceSlug: "landscape",
    image: exteriorImage,
    imageAlt: "Terraced garden following natural slope",
  },
  {
    id: "ls-5",
    orderLabel: "05",
    title: "Arrival Forecourt Plaza",
    country: "Ramallah, Palestine",
    tag: "Public Realm",
    category: "Cultural",
    serviceSlug: "landscape",
    image: aboutImage,
    imageAlt: "Formal arrival plaza with integrated planting",
  },
  // Exterior (5)
  {
    id: "ex-1",
    orderLabel: "01",
    title: "Glass Veil Tower",
    country: "Ramallah, Palestine",
    tag: "Facade Study",
    category: "Residential",
    serviceSlug: "exterior",
    image: exteriorImage,
    imageAlt: "Contemporary tower facade with glass rhythm",
  },
  {
    id: "ex-2",
    orderLabel: "02",
    title: "Limestone Villa Massing",
    country: "Bethlehem, Palestine",
    tag: "Villa Exterior",
    category: "Residential",
    serviceSlug: "exterior",
    image: interiorImage,
    imageAlt: "Limestone-clad villa with deep overhangs",
  },
  {
    id: "ex-3",
    orderLabel: "03",
    title: "Brise-Soleil Office Block",
    country: "Nablus, Palestine",
    tag: "Solar Shading",
    category: "Cultural",
    serviceSlug: "exterior",
    image: exteriorImage,
    imageAlt: "Office facade with horizontal brise-soleil",
  },
  {
    id: "ex-4",
    orderLabel: "04",
    title: "Corten Gatehouse",
    country: "Jericho, Palestine",
    tag: "Entry Pavilion",
    category: "Residential",
    serviceSlug: "exterior",
    image: aboutImage,
    imageAlt: "Corten steel entry pavilion at dusk",
  },
  {
    id: "ex-5",
    orderLabel: "05",
    title: "Seafront Culture House",
    country: "Bethlehem, Palestine",
    tag: "Cultural Destination",
    category: "Cultural",
    serviceSlug: "exterior",
    image: interiorImage,
    imageAlt: "Cultural building exterior at golden hour",
  },
  // Architecture Drone (5)
  {
    id: "dr-1",
    orderLabel: "01",
    title: "Site Topo Ortho-Mosaic",
    country: "Ramallah, Palestine",
    tag: "Aerial Survey",
    category: "Residential",
    serviceSlug: "architecture-drone",
    image: exteriorImage,
    imageAlt: "Aerial perspective over construction site",
  },
  {
    id: "dr-2",
    orderLabel: "02",
    title: "Tower Crane Progress Ring",
    country: "Nablus, Palestine",
    tag: "Progress Capture",
    category: "Residential",
    serviceSlug: "architecture-drone",
    image: interiorImage,
    imageAlt: "Drone view of high-rise under construction",
  },
  {
    id: "dr-3",
    orderLabel: "03",
    title: "Coastal Masterplan Flyover",
    country: "Gaza, Palestine",
    tag: "Masterplan Film",
    category: "Cultural",
    serviceSlug: "architecture-drone",
    image: aboutImage,
    imageAlt: "Urban coastline from elevated drone angle",
  },
  {
    id: "dr-4",
    orderLabel: "04",
    title: "Heritage Roof Documentation",
    country: "Bethlehem, Palestine",
    tag: "Heritage Scan",
    category: "Cultural",
    serviceSlug: "architecture-drone",
    image: aboutImage,
    imageAlt: "Close aerial documentation of historic roofscape",
  },
  {
    id: "dr-5",
    orderLabel: "05",
    title: "Solar Farm Layout QA",
    country: "Jericho, Palestine",
    tag: "Infrastructure",
    category: "Residential",
    serviceSlug: "architecture-drone",
    image: exteriorImage,
    imageAlt: "Wide aerial over solar array alignment",
  },
  // Architecture AI (5)
  {
    id: "ai-1",
    orderLabel: "01",
    title: "Optioneering Massing Study",
    country: "Ramallah, Palestine",
    tag: "Generative Massing",
    category: "Residential",
    serviceSlug: "architecture-ai",
    image: interiorImage,
    imageAlt: "Digital massing study overlay on site model",
  },
  {
    id: "ai-2",
    orderLabel: "02",
    title: "Facade Pattern Optimizer",
    country: "Nablus, Palestine",
    tag: "Performance Facade",
    category: "Cultural",
    serviceSlug: "architecture-ai",
    image: exteriorImage,
    imageAlt: "Parametric facade pattern visualization",
  },
  {
    id: "ai-3",
    orderLabel: "03",
    title: "Daylight Scenario Lab",
    country: "Bethlehem, Palestine",
    tag: "Simulation",
    category: "Residential",
    serviceSlug: "architecture-ai",
    image: interiorImage,
    imageAlt: "Interior daylight simulation heat map",
  },
  {
    id: "ai-4",
    orderLabel: "04",
    title: "Crescent Museum Annex",
    country: "Ramallah, Palestine",
    tag: "Cultural Expansion",
    category: "Cultural",
    serviceSlug: "architecture-ai",
    image: interiorImage,
    imageAlt: "Museum expansion concept visualization",
  },
  {
    id: "ai-5",
    orderLabel: "05",
    title: "Carbon Lite Structure Pack",
    country: "Ramallah, Palestine",
    tag: "Structural AI Assist",
    category: "Residential",
    serviceSlug: "architecture-ai",
    image: exteriorImage,
    imageAlt: "Structural diagram with optimization overlays",
  },
];

export const PROJECT_GALLERY_IMAGE_COUNT = 20;

const projectGalleryPool = [
  interiorImage,
  exteriorImage,
  landscapeImage,
  aboutImage,
] as const;

export interface ProjectGalleryImage {
  src: (typeof projectGalleryPool)[number];
  alt: string;
}

export interface ProjectDetailRow {
  label: string;
  value: string;
}

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((p) => p.id === slug);
}

export function getProjectSummary(project: Project): string {
  return `${project.title} — ${project.tag} in ${project.country}. A ${project.category.toLowerCase()} engagement delivered through our ${serviceFilterLabel(project.serviceSlug)} line with documentation and coordination built for serious developers.`;
}

export function getProjectDetailRows(project: Project): ProjectDetailRow[] {
  return [
    { label: "Location", value: project.country },
    { label: "Service line", value: serviceFilterLabel(project.serviceSlug) },
    { label: "Category", value: project.category },
    { label: "Focus", value: project.tag },
    { label: "Case ref.", value: project.orderLabel },
  ];
}

/** Twenty gallery frames per project (cycles local portfolio imagery). */
export function getProjectGallery(project: Project): ProjectGalleryImage[] {
  return Array.from({ length: PROJECT_GALLERY_IMAGE_COUNT }, (_, i) => {
    const src = projectGalleryPool[i % projectGalleryPool.length];
    return {
      src,
      alt: `${project.title} — gallery frame ${String(i + 1).padStart(2, "0")} of ${PROJECT_GALLERY_IMAGE_COUNT}`,
    };
  });
}

export function projectDetailPath(project: Project): string {
  return `/projects/${project.id}`;
}

export const hero = {
  titleLine1: "Design",
  titleLine2Words: ["That", "Drives", "Value"],
  description:
    "Interior, landscape, exterior, architecture drone, and architecture AI — precision-focused delivery for high-value projects.",
  image: exteriorImage,
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
  snapshotEyebrow: "Company snapshot",
  snapshotSub: "Key figures and operating focus",
  headlinePrimary: "Built for Serious",
  headlineAccent: "Developers",
  /** Single ~30-word company snapshot for the About column. */
  introParagraph:
    "Architecture, interiors, and engineering sit with one accountable OD Studio team, built for serious developers who demand bankable documentation, coordinated delivery, and premium outcomes without siloed consultants or excuse chains.",
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
  directorPortrait: ceoPortrait,
  directorPortraitAlt:
    "Portrait of Oday Abu Doha, founder and design director of OD Studio",
};

export interface ServiceItem {
  id: string;
  slug: ServiceSlug;
  orderLabel: string;
  title: string;
  description: string;
  icon: LucideIcon;
}

export const services: ServiceItem[] = [
  {
    id: "s1",
    slug: "interior",
    orderLabel: "01",
    title: "Interior",
    description:
      "Premium interior planning, material systems, and execution-ready detailing.",
    icon: Box,
  },
  {
    id: "s2",
    slug: "landscape",
    orderLabel: "02",
    title: "Landscape",
    description:
      "Landscape concept design, hardscape strategy, and outdoor spatial identity.",
    icon: MapPinned,
  },
  {
    id: "s3",
    slug: "exterior",
    orderLabel: "03",
    title: "Exterior",
    description:
      "Facade language, massing refinement, and exterior performance optimization.",
    icon: DraftingCompass,
  },
  {
    id: "s4",
    slug: "architecture-drone",
    orderLabel: "04",
    title: "Architecture Drone",
    description:
      "Aerial capture, site intelligence, and progress tracking for smarter decisions.",
    icon: MonitorPlay,
  },
  {
    id: "s5",
    slug: "architecture-ai",
    orderLabel: "05",
    title: "Architecture AI",
    description:
      "AI-assisted concept exploration, optimization, and performance-led design workflows.",
    icon: Layers3,
  },
];

export function isValidServiceSlug(value: string): value is ServiceSlug {
  return (serviceSlugs as readonly string[]).includes(value);
}

export function getServiceBySlug(slug: string) {
  return services.find((s) => s.slug === slug);
}

export function getProjectsByServiceSlug(slug: ServiceSlug) {
  return projects.filter((p) => p.serviceSlug === slug);
}

export function serviceFilterLabel(filter: ProjectServiceFilter): string {
  if (filter === "All") return "All";
  const svc = services.find((s) => s.slug === filter);
  return svc?.title ?? filter;
}

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
  image: string | StaticImageData;
  imageAlt: string;
}

export const testimonials: Testimonial[] = [
  {
    id: "t1",
    name: "Nora Al-Mansoori",
    role: "CEO, Meridian Developments",
    quote:
      "OD Studio reframed our project as a premium market product, and the positioning impact was immediate.",
    image: interiorImage,
    imageAlt: "Portrait of Elena Marchetti",
  },
  {
    id: "t2",
    name: "Adam Farouk",
    role: "Managing Partner, Axis Properties",
    quote:
      "Their technical discipline saved months in coordination while keeping the design intent exactly where it needed to be.",
    image: exteriorImage,
    imageAlt: "Portrait of James Okonkwo",
  },
  {
    id: "t3",
    name: "Leila Haddad",
    role: "Director, Atelier Hospitality Group",
    quote:
      "From concept to launch assets, they gave us a brand-level design story that directly improved client confidence.",
    image: aboutImage,
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

export const studioLocation = {
  eyebrow: "Studio Location",
  heading: "Where We Build",
  headingAccent: "From Ramallah",
  addressLine2: "Ramallah, Palestine",
  coordinates: { lat: 31.9038, lng: 35.2034 },
  mapEmbedUrl:
    "https://www.openstreetmap.org/export/embed.html?bbox=35.185%2C31.892%2C35.225%2C31.918&layer=mapnik&marker=31.9038%2C35.2034",
  directionsUrl:
    "https://www.google.com/maps/dir/?api=1&destination=31.9038%2C35.2034&travelmode=driving",
  openInMapsUrl: "https://www.google.com/maps/search/?api=1&query=Ramallah%2C+Palestine",
};

export const footer = {
  blurb:
    "OD Studio transforms complex briefs into high-value assets through design intelligence and engineering rigor.",
  /** Single-row footer strip (aligned with main navigation). */
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
    { href: "/projects?service=interior", label: "Interior" },
    { href: "/projects?service=landscape", label: "Landscape" },
    { href: "/projects?service=exterior", label: "Exterior" },
    { href: "/projects?service=architecture-drone", label: "Architecture Drone" },
    { href: "/projects?service=architecture-ai", label: "Architecture AI" },
  ],
  social: [
    { label: "Facebook", href: "https://facebook.com", icon: "facebook" as const },
    { label: "Instagram", href: "https://instagram.com", icon: "instagram" as const },
  ],
  copyright: "© 2026 OD Studio. All rights reserved.",
};
