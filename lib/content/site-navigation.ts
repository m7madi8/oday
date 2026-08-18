import type { StaticImageData } from "next/image";
import exteriorImage from "@/imgs/exterior.jpg";
import directorPortrait from "@/imgs/oday.jpeg";
import { about } from "@/lib/content/about";
import { contact } from "@/lib/content/contact";
import { services } from "@/lib/content/services";
import { exteriorProjectTypes, exteriorTypeLabel } from "@/lib/content/types";
import { studioLocation } from "@/lib/content/location";
import {
  galleryNavCovers,
  serviceVisualBySlug,
} from "@/lib/content/service-visuals";

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
  /** Keep the mega stage image fixed while the rail caption still updates. */
  lockStageVisual?: boolean;
}

export interface SearchEntry {
  id: string;
  group: "Projects" | "Services" | "Sections";
  title: string;
  subtitle?: string;
  href: string;
  keywords: string[];
}

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

  for (const type of exteriorProjectTypes) {
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
      image: contact.backgroundImage,
      imageAlt: contact.backgroundAlt,
      eyebrow: "Maps",
    },
    {
      id: "contact-email",
      label: "Email",
      href: contact.items.find((i) => i.label === "Email")?.href ?? "mailto:abodohaoday@gmail.com",
      description: contact.items.find((i) => i.label === "Email")?.value ?? "",
      image: contact.backgroundImage,
      imageAlt: contact.backgroundAlt,
      eyebrow: "Write",
    },
    {
      id: "contact-phone",
      label: "Phone",
      href: contact.items.find((i) => i.label === "Phone")?.href ?? "tel:+972568123413",
      description: contact.items.find((i) => i.label === "Phone")?.value ?? "",
      image: contact.backgroundImage,
      imageAlt: contact.backgroundAlt,
      eyebrow: "Call",
    },
    {
      id: "contact-book",
      label: contact.ctaLabel,
      href: contact.items.find((i) => i.label === "Email")?.href ?? "mailto:abodohaoday@gmail.com",
      description: contact.description,
      image: contact.backgroundImage,
      imageAlt: contact.backgroundAlt,
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
      lockStageVisual: true,
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
      image: galleryNavCovers.all.src,
      imageAlt: galleryNavCovers.all.alt,
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

/** Empty-state shortcuts — labels come from the same sources the nav and filters use. */
export const searchExploreTerms: ReadonlyArray<{ label: string; href: string }> = [
  { label: "Interior", href: "/projects?service=interior" },
  { label: "Exterior", href: "/projects?service=exterior" },
  ...exteriorProjectTypes.map((type) => ({
    label: exteriorTypeLabel(type),
    href: `/projects?service=exterior&type=${type}`,
  })),
  { label: "Ai architect", href: "/projects?service=architecture-ai" },
  { label: "Architect Dron", href: "/projects?service=architecture-drone" },
  { label: "About", href: "/#about" },
  { label: "Contact", href: "/#contact" },
];
