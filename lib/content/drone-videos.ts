import type { ServiceGalleryCopy, ServiceGalleryVideo } from "@/lib/content/service-gallery";

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

export const droneGalleryCopy: ServiceGalleryCopy = {
  eyebrow: "Architect Dron",
  title: "Aerial Intelligence",
  titleAccent: "Site & progress films",
  description:
    "High-resolution drone footage for site surveys, context studies, and progress documentation — delivered with architectural clarity.",
  badge: "Aerial Film",
  ctaHref: "/request/architecture-drone",
  ctaLabel: "Request Architect Dron brief",
  headingId: "drone-gallery-heading",
};
