import type { LucideIcon } from "lucide-react";
import { Compass, Globe2, Layers3 } from "lucide-react";
import ceoPortrait from "@/imgs/ceo.jpg";

export interface Strength {
  title: string;
  description: string;
  icon: LucideIcon;
}

export const about = {
  sectionNumber: "01",
  snapshotEyebrow: "Company snapshot",
  snapshotSub: "Key figures and operating focus",
  stats: [
    { label: "Projects", target: 500, prefix: "+", suffix: "" },
    { label: "Value", target: 50, prefix: "+", suffix: " million" },
  ],
  headlinePrimary: "Built for Serious",
  headlineAccent: "Developers",
  introParagraph:
    "Architecture, interiors, and engineering sit with one accountable OD Studio team, built for serious developers who demand bankable documentation, coordinated delivery, and premium outcomes without siloed consultants or excuse chains.",
  logoWordmark: "OD",
  logoSub: "STUDIO",
  strengths: [
    {
      title: "Design Strategy",
      description:
        "Every concept starts with spatial intent, material identity, and buildable clarity.",
      icon: Layers3,
    },
    {
      title: "Technical Authority",
      description:
        "BIM-led coordination, code compliance, and buildable detailing reduce execution risk.",
      icon: Compass,
    },
    {
      title: "Execution Control",
      description:
        "Clear milestones, transparent reporting, and site follow-up protect quality and timeline.",
      icon: Globe2,
    },
  ] satisfies Strength[],
  directorName: "Oday Abu Doha",
  directorRole: "Founder & Design Director",
  directorPortrait: ceoPortrait,
  directorPortraitAlt:
    "Portrait of Oday Abu Doha, founder and design director of OD Studio",
};
