import type { ServiceGalleryCopy, ServiceGalleryVideo } from "@/lib/content/service-gallery";

export type AiDesignVideo = ServiceGalleryVideo;

export const aiDesignVideos: ServiceGalleryVideo[] = [
  {
    id: "ai-dr-amal",
    orderLabel: "01",
    title: "AI Concept Film",
    client: "Dr. Amal",
    description:
      "Cinematic AI visualization exploring massing, material atmosphere, and spatial narrative for a premium residential brief.",
    src: "/ai/final-video-dr-amal.mp4",
    featured: true,
  },
  {
    id: "ai-hamada",
    orderLabel: "02",
    title: "Ai Architect Reel",
    client: "Hamada",
    description:
      "Workflow-led AI design study — rapid optioning, facade rhythm, and photoreal delivery for client presentation.",
    src: "/ai/final-video-hamada.mp4",
  },
];

export const aiDesignGalleryCopy: ServiceGalleryCopy = {
  eyebrow: "Ai architect",
  title: "AI-Assisted Visualization",
  titleAccent: "Cinematic deliverables",
  description:
    "Motion studies and AI-enhanced concept films — built for fast alignment, premium presentation, and design clarity.",
  badge: "AI Film",
  ctaHref: "/request/architecture-ai",
  ctaLabel: "Request Ai architect brief",
  headingId: "ai-gallery-heading",
};
