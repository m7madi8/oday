import type { StaticImageData } from "next/image";
import type { ServiceSlug } from "@/lib/content/types";
import exteriorServiceImage from "@/imgs/Exterior/Villa/villa 12 bh/ODAY_result.webp";
import exteriorSlide2 from "@/imgs/Exterior/Villa/villa 10 viv/ODAY_result.webp";
import exteriorSlide3 from "@/imgs/Exterior/Villa/hASSAN SALAMEH 27/ODAY_result.webp";
import interiorProject09 from "@/imgs/Interior/dr amal duaibes 13/ODAY_result.webp";
import interiorProject14 from "@/imgs/Interior/FARED MALABES 20/ODAY_result.webp";
import interiorProject32 from "@/imgs/Interior/saleh pizza 53/oday_result.webp";
import aiServiceImage from "@/imgs/services/ai-architect-cover.webp";
import droneServiceImage from "@/imgs/services/architect-drone-cover.webp";
import villaGalleryImage from "@/imgs/Exterior/Villa/villa 10 viv/ODAY_result.webp";
import residentialGalleryImage from "@/imgs/Exterior/residential building/zz hag 1213 08/ODAY_result.webp";
import cottageGalleryImage from "@/imgs/Exterior/Cottage/COTATGE ADAM 12/ODAY_result.webp";
import landscapeGalleryImage from "@/imgs/Exterior/landscape/nibal school 46/oday_result.webp";
import featuredGalleryImage from "@/imgs/Exterior/Villa/hASSAN SALAMEH 27/ODAY_result.webp";
import { aiDesignVideos } from "@/lib/content/ai-design-videos";
import { droneVideos } from "@/lib/content/drone-videos";

export type ServiceVisualSlide = {
  src: StaticImageData;
  alt: string;
  objectPosition: string;
};

export type ServiceVisualAsset = {
  src: StaticImageData;
  alt: string;
  objectPosition: string;
  videoSrc?: string;
  videoStartAt?: number;
  videoDuration?: number;
  slides?: readonly ServiceVisualSlide[];
};

const aiFeaturedVideo = aiDesignVideos.find((v) => v.featured)?.src ?? aiDesignVideos[0]?.src;
const droneFeaturedVideo = droneVideos.find((v) => v.featured)?.src ?? droneVideos[0]?.src;

/** Real portfolio covers for the four service panels / nav items. */
export const serviceVisualBySlug: Record<ServiceSlug, ServiceVisualAsset> = {
  exterior: {
    src: exteriorServiceImage,
    alt: "B.H Villa — exterior design case study",
    objectPosition: "50% 42%",
    slides: [
      {
        src: exteriorServiceImage,
        alt: "B.H Villa — exterior design case study",
        objectPosition: "52% 36%",
      },
      {
        src: exteriorSlide2,
        alt: "V I V villa — exterior design",
        objectPosition: "44% 42%",
      },
      {
        src: exteriorSlide3,
        alt: "HOUSE OF SUN — exterior design",
        objectPosition: "50% 40%",
      },
      {
        src: residentialGalleryImage,
        alt: "Residential building — exterior design",
        objectPosition: "50% 38%",
      },
    ],
  },
  interior: {
    src: interiorProject09,
    alt: "Dr. Amal Duaibes Dental Clinic — interior design",
    objectPosition: "50% 42%",
    slides: [
      {
        src: interiorProject09,
        alt: "Dr. Amal Duaibes Dental Clinic — interior design",
        objectPosition: "50% 42%",
      },
      {
        src: interiorProject14,
        alt: "Vanilla Lingerie — commercial interior design",
        objectPosition: "48% 40%",
      },
      {
        src: interiorProject32,
        alt: "Pizzeria Marzano — restaurant interior design",
        objectPosition: "50% 38%",
      },
    ],
  },
  "architecture-ai": {
    src: aiServiceImage,
    alt: "Ai architect cinematic preview",
    objectPosition: "50% 42%",
    videoSrc: aiFeaturedVideo,
    videoStartAt: 1.2,
    videoDuration: 5,
  },
  "architecture-drone": {
    src: droneServiceImage,
    alt: "Architect Dron aerial preview",
    objectPosition: "50% 38%",
    videoSrc: droneFeaturedVideo,
    videoStartAt: 3.6,
    videoDuration: 5,
  },
};

export const galleryNavCovers = {
  all: {
    src: featuredGalleryImage,
    alt: "HOUSE OF SUN — featured exterior case study",
  },
  interior: {
    src: interiorProject09,
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
    videoStartAt: 3.6,
    videoDuration: 5,
  },
} as const;
