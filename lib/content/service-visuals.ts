import type { StaticImageData } from "next/image";
import type { ServiceSlug } from "@/lib/content/types";
import exteriorServiceImage from "@/imgs/Exterior/Villa/villa 12 bh/ODAY_result.webp";
import interiorServiceImage from "@/imgs/Interior/batool 10/ODAY_result.webp";
import aiServiceImage from "@/imgs/Interior/dr amal duaibes 13/ODAY_result.webp";
import droneServiceImage from "@/imgs/Exterior/landscape/mohammad ram 40/oday_result.webp";
import villaGalleryImage from "@/imgs/Exterior/Villa/villa 10 viv/ODAY_result.webp";
import residentialGalleryImage from "@/imgs/Exterior/residential building/zz hag 1213 08/ODAY_result.webp";
import cottageGalleryImage from "@/imgs/Exterior/Cottage/COTATGE ADAM 12/ODAY_result.webp";
import landscapeGalleryImage from "@/imgs/Exterior/landscape/nibal school 46/oday_result.webp";
import featuredGalleryImage from "@/imgs/Exterior/Villa/hASSAN SALAMEH 27/ODAY_result.webp";
import { aiDesignVideos } from "@/lib/content/ai-design-videos";
import { droneVideos } from "@/lib/content/drone-videos";

export type ServiceVisualAsset = {
  src: StaticImageData;
  alt: string;
  objectPosition: string;
  videoSrc?: string;
  videoStartAt?: number;
  videoDuration?: number;
};

const aiFeaturedVideo = aiDesignVideos.find((v) => v.featured)?.src ?? aiDesignVideos[0]?.src;
const droneFeaturedVideo = droneVideos.find((v) => v.featured)?.src ?? droneVideos[0]?.src;

/** Real portfolio covers for the four service panels / nav items. */
export const serviceVisualBySlug: Record<ServiceSlug, ServiceVisualAsset> = {
  exterior: {
    src: exteriorServiceImage,
    alt: "B.H Villa — exterior design case study",
    objectPosition: "50% 42%",
  },
  interior: {
    src: interiorServiceImage,
    alt: "Batool interior — premium material and lighting study",
    objectPosition: "50% 40%",
  },
  "architecture-ai": {
    src: aiServiceImage,
    alt: "Ai architect cinematic preview",
    objectPosition: "48% 35%",
    videoSrc: aiFeaturedVideo,
    videoStartAt: 1.2,
    videoDuration: 5,
  },
  "architecture-drone": {
    src: droneServiceImage,
    alt: "Architect Dron aerial preview",
    objectPosition: "55% 30%",
    videoSrc: droneFeaturedVideo,
    videoStartAt: 2.0,
    videoDuration: 5,
  },
};

export const galleryNavCovers = {
  all: {
    src: featuredGalleryImage,
    alt: "HOUSE OF SUN — featured exterior case study",
  },
  interior: {
    src: interiorServiceImage,
    alt: "Interior design gallery preview",
  },
  exterior: {
    src: exteriorServiceImage,
    alt: "Exterior design gallery preview",
  },
  villas: {
    src: villaGalleryImage,
    alt: "Villas gallery preview",
  },
  "residential-buildings": {
    src: residentialGalleryImage,
    alt: "Residential buildings gallery preview",
  },
  cottage: {
    src: cottageGalleryImage,
    alt: "Cottage gallery preview",
  },
  landscape: {
    src: landscapeGalleryImage,
    alt: "Landscape gallery preview",
  },
  "architecture-ai": {
    src: aiServiceImage,
    alt: "Ai architect gallery preview",
    videoSrc: aiFeaturedVideo,
    videoStartAt: 1.2,
    videoDuration: 5,
  },
  "architecture-drone": {
    src: droneServiceImage,
    alt: "Architect Dron gallery preview",
    videoSrc: droneFeaturedVideo,
    videoStartAt: 2.0,
    videoDuration: 5,
  },
} as const;
