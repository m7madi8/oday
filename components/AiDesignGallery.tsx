"use client";

import { ServiceVideoGallery } from "@/components/ServiceVideoGallery";
import { aiDesignGalleryCopy, aiDesignVideos } from "@/lib/content/ai-design-videos";

export function AiDesignGallery() {
  return <ServiceVideoGallery copy={aiDesignGalleryCopy} videos={aiDesignVideos} />;
}
