"use client";

import { ServiceVideoGallery } from "@/components/ServiceVideoGallery";
import { droneGalleryCopy, droneVideos } from "@/lib/content/drone-videos";

export function DroneGallery() {
  return <ServiceVideoGallery copy={droneGalleryCopy} videos={droneVideos} />;
}
