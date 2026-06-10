import type { StaticImageData } from "next/image";
import aboutImage from "@/imgs/about.jpg";
import exteriorImage from "@/imgs/exterior.jpg";
import interiorImage from "@/imgs/interior.jpg";
import landscapeImage from "@/imgs/landscape.jpg";
import { cottageProjects, getCottageProjectGalleryImages } from "@/lib/exterior-cottage-projects";
import {
  getLandscapeProjectGalleryImages,
  landscapeProjects,
} from "@/lib/exterior-landscape-projects";
import {
  getResidentialProjectGalleryImages,
  residentialBuildingProjects,
} from "@/lib/exterior-residential-projects";
import { getVillaProjectGalleryImages, villaProjects } from "@/lib/exterior-villa-projects";
import { getInteriorProjectGalleryImages, interiorProjects } from "@/lib/interior-projects";
import { services } from "@/lib/content/services";
import { serviceSlugs, type ServiceSlug } from "@/lib/content/types";

export { serviceSlugs } from "@/lib/content/types";
export type { ServiceSlug } from "@/lib/content/types";
export { about } from "@/lib/content/about";
export type { Strength } from "@/lib/content/about";
export { services } from "@/lib/content/services";
export type { ServiceItem } from "@/lib/content/services";
export { faqItems } from "@/lib/content/faq";
export type { FaqItem } from "@/lib/content/faq";
export { contact, footer } from "@/lib/content/contact";
export type { ContactChannel } from "@/lib/content/contact";
export { studioLocation } from "@/lib/content/location";

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

/** Instagram deliverable (2550×2000) or cinematic still (1920×1080 / 16:9). */
export type ProjectGalleryFormat = "instagram" | "cinema";

export const projectGalleryFormatSpecs = {
  cinema: { width: 1920, height: 1080, aspect: 16 / 9, label: "1920 × 1080" },
  instagram: { width: 2550, height: 2000, aspect: 2550 / 2000, label: "2550 × 2000" },
} as const satisfies Record<
  ProjectGalleryFormat,
  { width: number; height: number; aspect: number; label: string }
>;

export function projectGalleryAspect(format: ProjectGalleryFormat): number {
  return projectGalleryFormatSpecs[format].aspect;
}

/** Unified gallery frame on project pages — Instagram deliverable (2550×2000). */
export const projectGalleryFrame = {
  width: 2550,
  height: 2000,
  aspect: 2550 / 2000,
  label: "2550 × 2000",
} as const;

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
  // Interior — imgs/Interior (37 projects)
  ...(interiorProjects as Project[]),
  // Exterior — folder imports
  ...(villaProjects as Project[]),
  ...(residentialBuildingProjects as Project[]),
  ...(cottageProjects as Project[]),
  ...(landscapeProjects as Project[]),
];

export const PROJECT_GALLERY_IMAGE_COUNT = 20;

const projectGalleryPool = [
  interiorImage,
  exteriorImage,
  landscapeImage,
  aboutImage,
] as const;

export interface ProjectGalleryImage {
  src: string | StaticImageData;
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

/** Gallery frames — folder-backed projects use local imagery; others cycle the portfolio pool. */
export function getProjectGallery(project: Project): ProjectGalleryImage[] {
  const format = resolveProjectGalleryFormat(project);
  const folderImages =
    getInteriorProjectGalleryImages(project.id) ??
    getVillaProjectGalleryImages(project.id) ??
    getResidentialProjectGalleryImages(project.id) ??
    getCottageProjectGalleryImages(project.id) ??
    getLandscapeProjectGalleryImages(project.id);
  if (folderImages?.length) {
    const total = folderImages.length;
    return folderImages.map((src, i) => ({
      src,
      alt: `${project.title} — gallery frame ${String(i + 1).padStart(2, "0")} of ${total}`,
      format,
    }));
  }
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

export { hero } from "@/lib/hero-content";

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
    id: "approxArea",
    label: "Approximate area",
    type: "text",
    required: true,
    placeholder: "e.g. 450 m² or 2,400 sq ft",
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
    { id: "site", title: "Site information", fieldIds: ["approxArea"] },
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
  ],
  sections: [
    { id: "contact", title: "Contact details", fieldIds: ["name", "email", "phone"] },
    { id: "video", title: "Video brief", fieldIds: ["videoNature"] },
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
