import type { ServiceGalleryVideo } from "@/lib/content/service-gallery";

export const droneVideos: ServiceGalleryVideo[] = [
  {
    id: "drone-site-reel",
    orderLabel: "01",
    title: "Aerial Site Film",
    client: "Site Intelligence",
    description:
      "Drone capture for site context, massing reads, and cinematic aerial reporting — built for faster decisions and sharper presentations.",
    src: "/drone/architect-dron-reel.mp4",
    featured: true,
  },
];

export const droneGalleryContent = {
  orderLabel: "04",
  eyebrow: "Architect Dron",
  title: "Aerial Intelligence",
  titleAccent: "Site & progress films",
  description:
    "High-resolution drone footage for site surveys, context studies, and progress documentation — delivered with architectural clarity.",
  highlights: ["Site surveys", "Context reads", "Progress reporting"],
  specs: [
    { label: "Delivery", value: "4K aerial reel" },
    { label: "Use case", value: "Site & progress" },
    { label: "Format", value: "Cinema aspect" },
  ],
  badge: "Aerial Film",
  ctaHref: "/request/architecture-drone",
  ctaLabel: "Request Architect Dron brief",
  headingId: "drone-gallery-heading",
} as const;

/** @deprecated Use droneGalleryContent */
export const droneGalleryCopy = {
  eyebrow: droneGalleryContent.eyebrow,
  orderLabel: droneGalleryContent.orderLabel,
  title: droneGalleryContent.title,
  titleAccent: droneGalleryContent.titleAccent,
  description: droneGalleryContent.description,
  highlights: [...droneGalleryContent.highlights],
  badge: droneGalleryContent.badge,
  ctaHref: droneGalleryContent.ctaHref,
  ctaLabel: droneGalleryContent.ctaLabel,
  headingId: droneGalleryContent.headingId,
};
