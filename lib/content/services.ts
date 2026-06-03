import type { LucideIcon } from "lucide-react";
import { Box, DraftingCompass, Layers3, MonitorPlay } from "lucide-react";
import type { ServiceSlug } from "@/lib/content/types";

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
    title: "Exterior Design",
    description:
      "Facade language, massing, landscape integration, and exterior performance optimization.",
    icon: DraftingCompass,
  },
  {
    id: "s1",
    slug: "interior",
    orderLabel: "02",
    title: "Interior Design",
    description:
      "Premium interior planning, material systems, and execution-ready detailing.",
    icon: Box,
  },
  {
    id: "s5",
    slug: "architecture-ai",
    orderLabel: "03",
    title: "Ai Design",
    description:
      "AI-assisted concept exploration, optimization, and performance-led design workflows.",
    icon: Layers3,
  },
  {
    id: "s4",
    slug: "architecture-drone",
    orderLabel: "04",
    title: "Architect Dron",
    description:
      "Aerial capture, site intelligence, and progress tracking for smarter decisions.",
    icon: MonitorPlay,
  },
];
