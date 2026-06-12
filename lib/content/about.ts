import directorPortrait from "@/imgs/oday.jpeg";

export interface Strength {
  title: string;
  description: string;
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
    "Architecture, interiors, and engineering sit with one accountable OD Architects team, built for serious developers who demand bankable documentation, coordinated delivery, and premium outcomes without siloed consultants or excuse chains.",
  logoWordmark: "OD",
  logoSub: "ARCHITECTS",
  strengths: [
    {
      title: "Design Strategy",
      description:
        "Every concept starts with spatial intent, material identity, and buildable clarity.",
    },
    {
      title: "Technical Authority",
      description:
        "BIM-led coordination, code compliance, and buildable detailing reduce execution risk.",
    },
    {
      title: "Execution Control",
      description:
        "Clear milestones, transparent reporting, and site follow-up protect quality and timeline.",
    },
  ] satisfies Strength[],
  directorName: "Oday Abu Doha",
  directorRole: "Founder & Design Director",
  directorPortrait,
  directorPortraitAlt:
    "Oday Abu Doha, founder and design director of OD Architects, in formal attire",
};
