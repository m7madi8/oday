import type { StaticImageData } from "next/image";
import aboutImage from "@/imgs/about.jpg";
import exteriorImage from "@/imgs/exterior.jpg";
import interiorImage from "@/imgs/interior.jpg";
import landscapeImage from "@/imgs/landscape.jpg";
import directorPortrait from "@/imgs/oday.jpeg";
import heroPrimary from "@/imgs/Exterior/Villa/villa 12 bh/ODAY_result.webp";
import {
  exteriorTypeLabel,
  projects,
  type ExteriorProjectType,
  type Project,
} from "@/lib/data";
import { about } from "@/lib/content/about";
import { contact } from "@/lib/content/contact";
import { getFeaturedProjects } from "@/lib/content/featured-projects";
import { services } from "@/lib/content/services";
import { studioLocation } from "@/lib/content/location";
import {
  galleryNavCovers,
  serviceVisualBySlug,
} from "@/lib/content/service-visuals";
import type { ServiceSlug } from "@/lib/content/types";

export type NavPanelId = "home" | "about" | "gallery" | "services" | "contact";

/** none = plain link; portrait = director card; mega = image hover menu */
export type NavPanelVariant = "none" | "portrait" | "mega";

export interface NavVisualItem {
  id: string;
  label: string;
  href: string;
  description: string;
  image: string | StaticImageData;
  imageAlt: string;
  eyebrow?: string;
  /** Optional muted preview clip for mega stage (AI / drone). */
  videoSrc?: string;
  /** Start time in seconds for the looping preview window. */
  videoStartAt?: number;
  /** Preview window length in seconds (default 5). */
  videoDuration?: number;
}

export interface NavPortraitContent {
  name: string;
  role: string;
  description: string;
  image: StaticImageData;
  imageAlt: string;
  ctaLabel: string;
}

export interface NavPanelConfig {
  id: NavPanelId;
  label: string;
  href: string;
  variant: NavPanelVariant;
  items: NavVisualItem[];
  portrait?: NavPortraitContent;
}

export interface SearchEntry {
  id: string;
  group: "Projects" | "Services" | "Sections";
  title: string;
  subtitle?: string;
  href: string;
  keywords: string[];
}

function firstProject(predicate: (p: Project) => boolean): Project | undefined {
  return projects.find(predicate);
}

function projectVisual(
  id: string,
  label: string,
  href: string,
  description: string,
  project: Project | undefined,
  fallbackImage: string | StaticImageData,
  fallbackAlt: string,
  eyebrow?: string,
): NavVisualItem {
  if (project) {
    return {
      id,
      label,
      href,
      description,
      image: project.image,
      imageAlt: project.imageAlt || `${label} — project preview`,
      eyebrow,
    };
  }
  return {
    id,
    label,
    href,
    description,
    image: fallbackImage,
    imageAlt: fallbackAlt,
    eyebrow,
  };
}

const fallbackProject = projects[0];

export function getAboutPortrait(): NavPortraitContent {
  return {
    name: about.directorName,
    role: about.directorRole,
    description:
      "Architecture, interiors, and engineering under one accountable studio — built for serious developers.",
    image: directorPortrait,
    imageAlt: about.directorPortraitAlt,
    ctaLabel: "Meet the studio",
  };
}

export function getGalleryNavItems(): NavVisualItem[] {
  const exteriorTypes: ExteriorProjectType[] = [
    "villas",
    "residential-buildings",
    "cottage",
    "landscape",
  ];

  const coverItem = (
    id: keyof typeof galleryNavCovers,
    label: string,
    href: string,
    description: string,
    eyebrow?: string,
  ): NavVisualItem => {
    const cover = galleryNavCovers[id];
    return {
      id,
      label,
      href,
      description,
      image: cover.src,
      imageAlt: cover.alt,
      eyebrow,
      ...("videoSrc" in cover && cover.videoSrc
        ? {
            videoSrc: cover.videoSrc,
            videoStartAt: "videoStartAt" in cover ? cover.videoStartAt : undefined,
            videoDuration: "videoDuration" in cover ? cover.videoDuration : undefined,
          }
        : {}),
    };
  };

  const items: NavVisualItem[] = [
    coverItem(
      "all",
      "All Projects",
      "/projects",
      "Full case-study archive across exterior, interior, AI, and drone delivery.",
      "Archive",
    ),
    coverItem(
      "interior",
      "Interior",
      "/projects?service=interior",
      "Premium interior planning, material systems, and execution-ready detailing.",
      "Design",
    ),
    coverItem(
      "exterior",
      "Exterior",
      "/projects?service=exterior",
      "Facade language, massing, and landscape-integrated residential work.",
      "Design",
    ),
  ];

  for (const type of exteriorTypes) {
    items.push(
      coverItem(
        type,
        exteriorTypeLabel(type),
        `/projects?service=exterior&type=${encodeURIComponent(type)}`,
        `${exteriorTypeLabel(type)} case studies from the exterior portfolio.`,
        "Exterior",
      ),
    );
  }

  items.push(
    coverItem(
      "architecture-ai",
      "Ai architect",
      "/projects?service=architecture-ai",
      "AI-assisted concept exploration and performance-led design workflows.",
      "Capability",
    ),
    coverItem(
      "architecture-drone",
      "Architect Dron",
      "/projects?service=architecture-drone",
      "Aerial capture, site intelligence, and progress tracking.",
      "Capability",
    ),
  );

  return items;
}

export function getServicesNavItems(): NavVisualItem[] {
  return services.map((service) => {
    const visual = serviceVisualBySlug[service.slug];
    return {
      id: service.slug,
      label: service.title,
      href: `/projects?service=${encodeURIComponent(service.slug)}`,
      description: service.description,
      image: visual.src,
      imageAlt: visual.alt,
      eyebrow: service.orderLabel,
      videoSrc: visual.videoSrc,
      videoStartAt: visual.videoStartAt,
      videoDuration: visual.videoDuration,
    };
  });
}

export function getContactNavItems(): NavVisualItem[] {
  return [
    {
      id: "contact-studio",
      label: "Studio Location",
      href: "/#contact",
      description: `${studioLocation.addressLine2} — visit or request directions.`,
      image: contact.backgroundImage,
      imageAlt: contact.backgroundAlt,
      eyebrow: "Visit",
    },
    {
      id: "contact-directions",
      label: "Get Directions",
      href: studioLocation.directionsUrl,
      description: "Open Google Maps driving directions to the studio.",
      image: exteriorImage,
      imageAlt: "Directions to OD Architects",
      eyebrow: "Maps",
    },
    {
      id: "contact-email",
      label: "Email",
      href: contact.items.find((i) => i.label === "Email")?.href ?? "mailto:abodohaoday@gmail.com",
      description: contact.items.find((i) => i.label === "Email")?.value ?? "",
      image: aboutImage,
      imageAlt: "Contact OD Architects by email",
      eyebrow: "Write",
    },
    {
      id: "contact-phone",
      label: "Phone",
      href: contact.items.find((i) => i.label === "Phone")?.href ?? "tel:+972568123413",
      description: contact.items.find((i) => i.label === "Phone")?.value ?? "",
      image: directorPortrait,
      imageAlt: "Call OD Architects",
      eyebrow: "Call",
    },
    {
      id: "contact-book",
      label: contact.ctaLabel,
      href: contact.items.find((i) => i.label === "Email")?.href ?? "mailto:abodohaoday@gmail.com",
      description: contact.description,
      image: heroPrimary,
      imageAlt: "Book a discovery call",
      eyebrow: "Start",
    },
  ];
}

export function getPrimaryNavPanels(): NavPanelConfig[] {
  return [
    { id: "home", label: "Home", href: "/#top", variant: "none", items: [] },
    {
      id: "about",
      label: "About",
      href: "/#about",
      variant: "portrait",
      items: [],
      portrait: getAboutPortrait(),
    },
    {
      id: "gallery",
      label: "Gallery",
      href: "/#gallery",
      variant: "mega",
      items: getGalleryNavItems(),
    },
    {
      id: "services",
      label: "Services",
      href: "/#services",
      variant: "mega",
      items: getServicesNavItems(),
    },
    {
      id: "contact",
      label: "Contact",
      href: "/#contact",
      variant: "mega",
      items: getContactNavItems(),
    },
  ];
}

export function getSiteSections(): NavVisualItem[] {
  return [
    {
      id: "about",
      label: "About",
      href: "/#about",
      description: "Studio strengths, delivery model, and design culture.",
      image: about.directorPortrait,
      imageAlt: about.directorPortraitAlt,
      eyebrow: "Studio",
    },
    {
      id: "services",
      label: "Services",
      href: "/#services",
      description: "Exterior, interior, AI architecture, and drone intelligence.",
      image: exteriorImage,
      imageAlt: "Services overview",
      eyebrow: "Studio",
    },
    {
      id: "gallery",
      label: "Gallery",
      href: "/#gallery",
      description: "Featured case studies and curated project highlights.",
      image: getFeaturedProjects()[0]?.image ?? aboutImage,
      imageAlt: "Featured gallery",
      eyebrow: "Studio",
    },
    {
      id: "contact",
      label: "Contact",
      href: "/#contact",
      description: "Start a discovery conversation with the studio.",
      image: contact.backgroundImage,
      imageAlt: contact.backgroundAlt,
      eyebrow: "Studio",
    },
  ];
}

export const searchExploreTerms = [
  { label: "Interior", href: "/projects?service=interior" },
  { label: "Exterior", href: "/projects?service=exterior" },
  { label: "Villas", href: "/projects?service=exterior&type=villas" },
  { label: "Residential Buildings", href: "/projects?service=exterior&type=residential-buildings" },
  { label: "Cottage", href: "/projects?service=exterior&type=cottage" },
  { label: "Landscape", href: "/projects?service=exterior&type=landscape" },
  { label: "Ai architect", href: "/projects?service=architecture-ai" },
  { label: "Architect Dron", href: "/projects?service=architecture-drone" },
  { label: "About", href: "/#about" },
  { label: "Contact", href: "/#contact" },
] as const;

export function buildSearchIndex(): SearchEntry[] {
  const entries: SearchEntry[] = [];

  for (const project of projects) {
    const keywords = [
      project.title,
      project.tag,
      project.country,
      project.category,
      project.serviceSlug,
      project.exteriorType ?? "",
      project.projectType ?? "",
      project.year ?? "",
      project.orderLabel,
    ]
      .filter(Boolean)
      .map((k) => k.toLowerCase());

    entries.push({
      id: `project-${project.id}`,
      group: "Projects",
      title: project.title,
      subtitle: [project.tag, project.country].filter(Boolean).join(" · "),
      href: `/projects/${project.id}`,
      keywords,
    });
  }

  for (const service of services) {
    entries.push({
      id: `service-${service.slug}`,
      group: "Services",
      title: service.title,
      subtitle: service.description,
      href: `/#services`,
      keywords: [service.title, service.description, service.slug].map((k) =>
        k.toLowerCase(),
      ),
    });
    entries.push({
      id: `service-gallery-${service.slug}`,
      group: "Services",
      title: `${service.title} gallery`,
      subtitle: "Open filtered project gallery",
      href: `/projects?service=${encodeURIComponent(service.slug as ServiceSlug)}`,
      keywords: [service.title, service.slug, "gallery", "projects"].map((k) =>
        k.toLowerCase(),
      ),
    });
  }

  for (const section of getSiteSections()) {
    entries.push({
      id: `section-${section.id}`,
      group: "Sections",
      title: section.label,
      subtitle: section.description,
      href: section.href,
      keywords: [section.label, section.description, section.id].map((k) =>
        k.toLowerCase(),
      ),
    });
  }

  return entries;
}

export function filterSearchIndex(query: string, index: SearchEntry[]): SearchEntry[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const tokens = q.split(/\s+/).filter(Boolean);

  return index
    .map((entry) => {
      const hay = [entry.title, entry.subtitle ?? "", ...entry.keywords]
        .join(" ")
        .toLowerCase();
      const score = tokens.reduce((acc, token) => {
        if (entry.title.toLowerCase().includes(token)) return acc + 6;
        if (hay.includes(token)) return acc + 2;
        return acc;
      }, 0);
      return { entry, score };
    })
    .filter((row) => row.score > 0)
    .sort((a, b) => b.score - a.score || a.entry.title.localeCompare(b.entry.title))
    .slice(0, 24)
    .map((row) => row.entry);
}
