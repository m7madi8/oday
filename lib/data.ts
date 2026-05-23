import type { LucideIcon } from "lucide-react";
import type { StaticImageData } from "next/image";
import {
  Compass,
  DraftingCompass,
  Globe2,
  Layers3,
  Box,
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
  { href: "#faq", label: "FAQ" },
  { href: "#contact", label: "Contact" },
] as const;

export type ProjectCategory = "Residential" | "Cultural";

export const serviceSlugs = [
  "exterior",
  "interior",
  "architecture-drone",
  "architecture-ai",
] as const;

export type ServiceSlug = (typeof serviceSlugs)[number];

/** Sub-categories within the Exterior gallery (includes former Landscape work). */
export const exteriorProjectTypes = [
  "villas",
  "residential-buildings",
  "cottage",
  "landscape",
  "general",
] as const;

export type ExteriorProjectType = (typeof exteriorProjectTypes)[number];

export const exteriorProjectTypeFilters = ["All", ...exteriorProjectTypes] as const;
export type ExteriorProjectTypeFilter = (typeof exteriorProjectTypeFilters)[number];

export const projectServiceFilters = ["All", ...serviceSlugs] as const;
export type ProjectServiceFilter = (typeof projectServiceFilters)[number];

/** @deprecated Use projectServiceFilters for gallery filtering */
export const projectFilters = projectServiceFilters;
export type ProjectFilter = ProjectServiceFilter;

/** Instagram portrait post (~4:5) or cinematic still (16:9 / 1920×1080). */
export type ProjectGalleryFormat = "instagram" | "cinema";

export interface Project {
  id: string;
  orderLabel: string;
  title: string;
  country: string;
  tag: string;
  category: ProjectCategory;
  serviceSlug: ServiceSlug;
  /** Required when serviceSlug is exterior — drives gallery sub-filters. */
  exteriorType?: ExteriorProjectType;
  image: string | StaticImageData;
  imageAlt: string;
  /** Gallery frame shape: Instagram post (4:5) or cinematic 16:9. Inferred when omitted. */
  galleryFormat?: ProjectGalleryFormat;
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
  // Exterior — 5 projects per collection (25 total)
  // Villas (5)
  {
    id: "vil-1",
    orderLabel: "01",
    title: "Cliffline Signature Villas",
    country: "Nablus, Palestine",
    tag: "Residential Collection",
    category: "Residential",
    serviceSlug: "exterior",
    exteriorType: "villas",
    image: aboutImage,
    imageAlt: "Architectural landscaping with modern villa context",
  },
  {
    id: "vil-2",
    orderLabel: "02",
    title: "Limestone Villa Massing",
    country: "Bethlehem, Palestine",
    tag: "Villa Exterior",
    category: "Residential",
    serviceSlug: "exterior",
    exteriorType: "villas",
    image: interiorImage,
    imageAlt: "Limestone-clad villa with deep overhangs",
  },
  {
    id: "vil-3",
    orderLabel: "03",
    title: "Courtyard Palm Residence",
    country: "Ramallah, Palestine",
    tag: "Private Villa",
    category: "Residential",
    serviceSlug: "exterior",
    exteriorType: "villas",
    image: exteriorImage,
    imageAlt: "Villa courtyard with palm canopy and stone walls",
  },
  {
    id: "vil-4",
    orderLabel: "04",
    title: "Ridge Horizon Villa",
    country: "Jericho, Palestine",
    tag: "Hillside Villa",
    category: "Residential",
    serviceSlug: "exterior",
    exteriorType: "villas",
    image: landscapeImage,
    imageAlt: "Villa silhouette along a desert ridge at dusk",
  },
  {
    id: "vil-5",
    orderLabel: "05",
    title: "Marble Pool Pavilion",
    country: "Nablus, Palestine",
    tag: "Pool Villa",
    category: "Residential",
    serviceSlug: "exterior",
    exteriorType: "villas",
    image: aboutImage,
    imageAlt: "Villa pool deck with marble coping and minimal facade",
  },
  // Residential Buildings (5)
  {
    id: "res-1",
    orderLabel: "01",
    title: "Glass Veil Tower",
    country: "Ramallah, Palestine",
    tag: "Facade Study",
    category: "Residential",
    serviceSlug: "exterior",
    exteriorType: "residential-buildings",
    image: exteriorImage,
    imageAlt: "Contemporary tower facade with glass rhythm",
  },
  {
    id: "res-2",
    orderLabel: "02",
    title: "Brise-Soleil Office Block",
    country: "Nablus, Palestine",
    tag: "Solar Shading",
    category: "Cultural",
    serviceSlug: "exterior",
    exteriorType: "residential-buildings",
    image: exteriorImage,
    imageAlt: "Office facade with horizontal brise-soleil",
  },
  {
    id: "res-3",
    orderLabel: "03",
    title: "Terrace Apartment Stack",
    country: "Bethlehem, Palestine",
    tag: "Multi-Unit Housing",
    category: "Residential",
    serviceSlug: "exterior",
    exteriorType: "residential-buildings",
    image: interiorImage,
    imageAlt: "Stacked apartment terraces with planted edges",
  },
  {
    id: "res-4",
    orderLabel: "04",
    title: "Urban Corner Tower",
    country: "Ramallah, Palestine",
    tag: "Mixed-Use Shell",
    category: "Cultural",
    serviceSlug: "exterior",
    exteriorType: "residential-buildings",
    image: aboutImage,
    imageAlt: "Corner tower with stone base and glazed upper volume",
  },
  {
    id: "res-5",
    orderLabel: "05",
    title: "Garden Court Residences",
    country: "Nablus, Palestine",
    tag: "Courtyard Block",
    category: "Residential",
    serviceSlug: "exterior",
    exteriorType: "residential-buildings",
    image: landscapeImage,
    imageAlt: "Residential block wrapping a shared garden court",
  },
  // Cottage (5)
  {
    id: "cot-1",
    orderLabel: "01",
    title: "Corten Gatehouse",
    country: "Jericho, Palestine",
    tag: "Entry Pavilion",
    category: "Residential",
    serviceSlug: "exterior",
    exteriorType: "cottage",
    image: aboutImage,
    imageAlt: "Corten steel entry pavilion at dusk",
  },
  {
    id: "cot-2",
    orderLabel: "02",
    title: "Stone Garden Cottage",
    country: "Bethlehem, Palestine",
    tag: "Retreat Cottage",
    category: "Residential",
    serviceSlug: "exterior",
    exteriorType: "cottage",
    image: landscapeImage,
    imageAlt: "Small stone cottage nestled in a planted garden",
  },
  {
    id: "cot-3",
    orderLabel: "03",
    title: "Timber Canopy Shelter",
    country: "Ramallah, Palestine",
    tag: "Pool Pavilion",
    category: "Residential",
    serviceSlug: "exterior",
    exteriorType: "cottage",
    image: exteriorImage,
    imageAlt: "Timber canopy structure beside a quiet pool",
  },
  {
    id: "cot-4",
    orderLabel: "04",
    title: "Hillside Guest Lodge",
    country: "Nablus, Palestine",
    tag: "Guest Lodge",
    category: "Residential",
    serviceSlug: "exterior",
    exteriorType: "cottage",
    image: interiorImage,
    imageAlt: "Compact guest lodge with wide eaves on a hillside",
  },
  {
    id: "cot-5",
    orderLabel: "05",
    title: "Courtyard Tea House",
    country: "Jericho, Palestine",
    tag: "Tea Pavilion",
    category: "Cultural",
    serviceSlug: "exterior",
    exteriorType: "cottage",
    image: aboutImage,
    imageAlt: "Intimate tea pavilion opening to a shaded courtyard",
  },
  // Landscape (5)
  {
    id: "lsc-1",
    orderLabel: "01",
    title: "Olive Grove Courtyard",
    country: "Ramallah, Palestine",
    tag: "Courtyard Garden",
    category: "Cultural",
    serviceSlug: "exterior",
    exteriorType: "landscape",
    image: interiorImage,
    imageAlt: "Courtyard garden with olive trees and stone paving",
  },
  {
    id: "lsc-2",
    orderLabel: "02",
    title: "Linear Reflecting Pools",
    country: "Bethlehem, Palestine",
    tag: "Water Feature",
    category: "Residential",
    serviceSlug: "exterior",
    exteriorType: "landscape",
    image: exteriorImage,
    imageAlt: "Reflecting pool alongside contemporary architecture",
  },
  {
    id: "lsc-3",
    orderLabel: "03",
    title: "Terraced Hillside Estate",
    country: "Nablus, Palestine",
    tag: "Terraced Landscape",
    category: "Residential",
    serviceSlug: "exterior",
    exteriorType: "landscape",
    image: exteriorImage,
    imageAlt: "Terraced garden following natural slope",
  },
  {
    id: "lsc-4",
    orderLabel: "04",
    title: "Arrival Forecourt Plaza",
    country: "Ramallah, Palestine",
    tag: "Public Realm",
    category: "Cultural",
    serviceSlug: "exterior",
    exteriorType: "landscape",
    image: aboutImage,
    imageAlt: "Formal arrival plaza with integrated planting",
  },
  {
    id: "lsc-5",
    orderLabel: "05",
    title: "Native Meadow Walk",
    country: "Jericho, Palestine",
    tag: "Softscape Path",
    category: "Residential",
    serviceSlug: "exterior",
    exteriorType: "landscape",
    image: landscapeImage,
    imageAlt: "Walking path through native meadow planting",
  },
  // General (5)
  {
    id: "gen-1",
    orderLabel: "01",
    title: "Seafront Culture House",
    country: "Bethlehem, Palestine",
    tag: "Cultural Destination",
    category: "Cultural",
    serviceSlug: "exterior",
    exteriorType: "general",
    image: interiorImage,
    imageAlt: "Cultural building exterior at golden hour",
  },
  {
    id: "gen-2",
    orderLabel: "02",
    title: "Civic Assembly Hall",
    country: "Ramallah, Palestine",
    tag: "Public Architecture",
    category: "Cultural",
    serviceSlug: "exterior",
    exteriorType: "general",
    image: exteriorImage,
    imageAlt: "Civic hall facade with monumental portico",
  },
  {
    id: "gen-3",
    orderLabel: "03",
    title: "Innovation Campus Hub",
    country: "Nablus, Palestine",
    tag: "Campus Gateway",
    category: "Cultural",
    serviceSlug: "exterior",
    exteriorType: "general",
    image: aboutImage,
    imageAlt: "Campus gateway building with layered canopies",
  },
  {
    id: "gen-4",
    orderLabel: "04",
    title: "Harbor Arts Warehouse",
    country: "Jericho, Palestine",
    tag: "Adaptive Reuse",
    category: "Cultural",
    serviceSlug: "exterior",
    exteriorType: "general",
    image: landscapeImage,
    imageAlt: "Converted warehouse with new cultural facade",
  },
  {
    id: "gen-5",
    orderLabel: "05",
    title: "Desert Observatory Deck",
    country: "Bethlehem, Palestine",
    tag: "Landmark Structure",
    category: "Residential",
    serviceSlug: "exterior",
    exteriorType: "general",
    image: exteriorImage,
    imageAlt: "Observatory deck structure in open desert landscape",
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
  format: ProjectGalleryFormat;
}

export function resolveProjectGalleryFormat(project: Project): ProjectGalleryFormat {
  if (project.galleryFormat) return project.galleryFormat;
  if (project.serviceSlug === "exterior") {
    return project.exteriorType === "residential-buildings" || project.exteriorType === "general"
      ? "cinema"
      : "instagram";
  }
  if (project.serviceSlug === "architecture-drone") return "cinema";
  if (project.serviceSlug === "architecture-ai") return "instagram";
  const n = Number.parseInt(project.orderLabel, 10);
  return Number.isFinite(n) && n % 2 === 0 ? "cinema" : "instagram";
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
  const rows: ProjectDetailRow[] = [
    { label: "Location", value: project.country },
    { label: "Service line", value: serviceFilterLabel(project.serviceSlug) },
  ];
  if (project.serviceSlug === "exterior" && project.exteriorType) {
    rows.push({ label: "Exterior type", value: exteriorTypeLabel(project.exteriorType) });
  }
  rows.push(
    { label: "Category", value: project.category },
    { label: "Focus", value: project.tag },
    { label: "Case ref.", value: project.orderLabel },
  );
  return rows;
}

/** Twenty gallery frames per project (cycles local portfolio imagery). */
export function getProjectGallery(project: Project): ProjectGalleryImage[] {
  const format = resolveProjectGalleryFormat(project);
  return Array.from({ length: PROJECT_GALLERY_IMAGE_COUNT }, (_, i) => {
    const src = projectGalleryPool[i % projectGalleryPool.length];
    return {
      src,
      alt: `${project.title} — gallery frame ${String(i + 1).padStart(2, "0")} of ${PROJECT_GALLERY_IMAGE_COUNT}`,
      format,
    };
  });
}

export function projectDetailPath(project: Project): string {
  return `/projects/${project.id}`;
}

export const hero = {
  headlineEyebrow: "Architecture · Engineering · Delivery",
  headlineLead: "We Design For",
  headlineAccentLead: "A Better",
  headlineAccentEmphasis: "Life",
  headlineSubline:
    "Engineering discipline and design authority — built to elevate assets, environments, and the lives within them.",
  ctaEyebrow: "Case Studies",
  ctaLabel: "View All Projects",
  titleLine1: "Design",
  titleLine2Words: ["That", "Drives", "Value"],
  description:
    "Interior, exterior (including landscape), architecture drone, and architecture AI — precision-focused delivery for high-value projects.",
  image: exteriorImage,
  imageAlt: "Modern desert villa at sunset with infinity pool and mountain backdrop",
  stats: [
    { label: "Total", value: 500, prefix: "+", suffix: "" },
    { label: "Value", value: 60, prefix: "+", suffix: " million" },
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
    id: "s3",
    slug: "exterior",
    orderLabel: "01",
    title: "Exterior",
    description:
      "Facade language, massing, landscape integration, and exterior performance optimization.",
    icon: DraftingCompass,
  },
  {
    id: "s1",
    slug: "interior",
    orderLabel: "02",
    title: "Interior",
    description:
      "Premium interior planning, material systems, and execution-ready detailing.",
    icon: Box,
  },
  {
    id: "s4",
    slug: "architecture-drone",
    orderLabel: "03",
    title: "Architecture Drone",
    description:
      "Aerial capture, site intelligence, and progress tracking for smarter decisions.",
    icon: MonitorPlay,
  },
  {
    id: "s5",
    slug: "architecture-ai",
    orderLabel: "04",
    title: "Architecture AI",
    description:
      "AI-assisted concept exploration, optimization, and performance-led design workflows.",
    icon: Layers3,
  },
];

export function isValidServiceSlug(value: string): value is ServiceSlug {
  return (serviceSlugs as readonly string[]).includes(value);
}

export function isValidExteriorProjectType(value: string): value is ExteriorProjectType {
  return (exteriorProjectTypes as readonly string[]).includes(value);
}

export function exteriorTypeLabel(type: ExteriorProjectType): string {
  const labels: Record<ExteriorProjectType, string> = {
    villas: "Villas",
    "residential-buildings": "Residential Buildings",
    cottage: "Cottage",
    landscape: "Landscape",
    general: "General",
  };
  return labels[type];
}

export type ExteriorGalleryLayout =
  | "dual-feature"
  | "tower-pair"
  | "solo-hero"
  | "landscape-grid"
  | "cultural-spotlight";

export interface ExteriorGalleryCollection {
  type: ExteriorProjectType;
  orderLabel: string;
  title: string;
  tagline: string;
  description: string;
  accent: string;
  layout: ExteriorGalleryLayout;
}

export const exteriorGalleryCollections: ExteriorGalleryCollection[] = [
  {
    type: "villas",
    orderLabel: "01",
    title: "Villas",
    tagline: "Signature residences",
    description:
      "Private villa massing, material palettes, and facade rhythm shaped for prestige and climate performance.",
    accent: "#f5c518",
    layout: "dual-feature",
  },
  {
    type: "residential-buildings",
    orderLabel: "02",
    title: "Residential Buildings",
    tagline: "Urban & mid-rise fabric",
    description:
      "Multi-unit and tower exteriors — solar shading, glazing strategy, and identity at street scale.",
    accent: "#8ba4b4",
    layout: "tower-pair",
  },
  {
    type: "cottage",
    orderLabel: "03",
    title: "Cottage",
    tagline: "Intimate architecture",
    description:
      "Compact pavilions and gatehouses where every edge, material joint, and threshold reads at human scale.",
    accent: "#b8734a",
    layout: "solo-hero",
  },
  {
    type: "landscape",
    orderLabel: "04",
    title: "Landscape",
    tagline: "Outdoor identity",
    description:
      "Courtyards, terraces, water features, and arrival sequences integrated with the built form.",
    accent: "#6b8f71",
    layout: "landscape-grid",
  },
  {
    type: "general",
    orderLabel: "05",
    title: "General",
    tagline: "Cultural & mixed scope",
    description:
      "Distinct destinations and mixed briefs where exterior narrative carries brand and public presence.",
    accent: "#a89888",
    layout: "cultural-spotlight",
  },
];

export function getExteriorGalleryCollection(
  type: ExteriorProjectType,
): ExteriorGalleryCollection | undefined {
  return exteriorGalleryCollections.find((c) => c.type === type);
}

export function getExteriorProjectsByType(type: ExteriorProjectType): Project[] {
  return projects.filter((p) => p.serviceSlug === "exterior" && p.exteriorType === type);
}

export function getExteriorProjectCount(type: ExteriorProjectType): number {
  return getExteriorProjectsByType(type).length;
}

export function getServiceBySlug(slug: string) {
  return services.find((s) => s.slug === slug);
}

export type ServiceRequestFieldType = "text" | "email" | "tel" | "textarea" | "file";

export interface ServiceRequestField {
  id: string;
  label: string;
  type: ServiceRequestFieldType;
  required?: boolean;
  placeholder?: string;
  accept?: string;
  rows?: number;
  helperText?: string;
  autoComplete?: string;
  /** Allow multiple files (images, etc.). */
  multiple?: boolean;
}

export interface ServiceRequestSection {
  id: string;
  title: string;
  fieldIds: string[];
}

/** At least one of the listed file fields must have attachments. */
export interface ServiceRequestOneOfRule {
  message: string;
  fieldIds: string[];
}

export interface ServiceRequestConfig {
  fields: ServiceRequestField[];
  sections: ServiceRequestSection[];
  requireOneOf?: ServiceRequestOneOfRule[];
}

/** Shared request fields for Exterior, Interior, and Landscape. */
export const standardSiteRequestFields: ServiceRequestField[] = [
  { id: "name", label: "Full name", type: "text", required: true, autoComplete: "name" },
  {
    id: "email",
    label: "Email",
    type: "email",
    required: false,
    placeholder: "Optional",
    autoComplete: "email",
  },
  { id: "phone", label: "Phone", type: "tel", required: true, autoComplete: "tel" },
  {
    id: "sitePlan",
    label: "Site / plot plan",
    type: "file",
    required: true,
    accept: ".pdf,.dwg,.dxf,image/*",
    helperText: "Survey or plot plan (PDF, DWG, DXF, or image). Attach the file in your email after submit.",
  },
  {
    id: "approxArea",
    label: "Approximate area",
    type: "text",
    required: true,
    placeholder: "e.g. 450 m² or 2,400 sq ft",
  },
  {
    id: "video",
    label: "Video",
    type: "file",
    required: false,
    accept: "video/*",
    helperText: "Optional site walkthrough or context video. Attach in your email after submit.",
  },
  {
    id: "description",
    label: "Description",
    type: "textarea",
    required: false,
    rows: 4,
    placeholder: "Optional: scope, goals, or site context.",
  },
  {
    id: "designReference",
    label: "Theme or design reference",
    type: "textarea",
    required: false,
    rows: 3,
    placeholder: "Optional: links, mood, or a specific theme you want to explore.",
  },
  {
    id: "notes",
    label: "Notes",
    type: "textarea",
    required: false,
    rows: 3,
    placeholder: "Optional: timing, constraints, or anything else we should know.",
  },
];

export const standardSiteRequestConfig: ServiceRequestConfig = {
  fields: standardSiteRequestFields,
  sections: [
    { id: "contact", title: "Contact details", fieldIds: ["name", "email", "phone"] },
    { id: "site", title: "Site information", fieldIds: ["sitePlan", "approxArea", "video"] },
    { id: "brief", title: "Brief & references", fieldIds: ["description", "designReference", "notes"] },
  ],
};

export const architectureAiRequestConfig: ServiceRequestConfig = {
  fields: [
    { id: "name", label: "Full name", type: "text", required: true, autoComplete: "name" },
    { id: "email", label: "Email", type: "email", required: true, autoComplete: "email" },
    { id: "phone", label: "Phone", type: "tel", required: true, autoComplete: "tel" },
    {
      id: "videoNature",
      label: "Required video style & nature",
      type: "textarea",
      required: true,
      rows: 4,
      placeholder: "Describe the video type, mood, pacing, and deliverables you need.",
    },
    {
      id: "renderPhotos",
      label: "Final render images",
      type: "file",
      multiple: true,
      accept: "image/*",
      helperText: "Optional if you attach real photos below. Attach files in your email after submit.",
    },
    {
      id: "realPhotos",
      label: "Real photos",
      type: "file",
      multiple: true,
      accept: "image/*",
      helperText: "Optional if you attach render images above. Attach files in your email after submit.",
    },
  ],
  sections: [
    { id: "contact", title: "Contact details", fieldIds: ["name", "email", "phone"] },
    { id: "video", title: "Video brief", fieldIds: ["videoNature"] },
    { id: "photos", title: "Reference images", fieldIds: ["renderPhotos", "realPhotos"] },
  ],
  requireOneOf: [
    {
      message: "Final render images and/or real photos",
      fieldIds: ["renderPhotos", "realPhotos"],
    },
  ],
};

/** Per-service request forms. Services without an entry use the default brief form. */
export const serviceRequestConfigs: Partial<Record<ServiceSlug, ServiceRequestConfig>> = {
  exterior: standardSiteRequestConfig,
  interior: standardSiteRequestConfig,
  "architecture-ai": architectureAiRequestConfig,
};

/** @deprecated Use serviceRequestConfigs */
export const serviceRequestFields: Partial<Record<ServiceSlug, ServiceRequestField[]>> = {
  exterior: standardSiteRequestFields,
  interior: standardSiteRequestFields,
  "architecture-ai": architectureAiRequestConfig.fields,
};

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
      value: "abodohaoday@gmail.com",
      href: "mailto:abodohaoday@gmail.com",
    },
    {
      label: "Phone",
      value: "+972 56-812-3413",
      href: "tel:+972568123413",
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
