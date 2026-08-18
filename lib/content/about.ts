import directorPortrait from "@/imgs/oday.jpeg";

export interface Strength {
  title: string;
  description: string;
}

export const about = {
  sectionNumber: "01",
  snapshotEyebrow: "About",
  stats: [
    { label: "Projects", target: 500, prefix: "+", suffix: "" },
    { label: "Value", target: 50, prefix: "+", suffix: " million" },
  ],
  headlinePrimary: "Built for",
  headlineAccent: "serious developers",
  logoWordmark: "OD",
  logoSub: "ARCHITECTS",
  studioTagline:
    "Full-scope architecture, interiors, and engineering — one accountable studio from concept to site.",
  strengths: [
    {
      title: "One team",
      description: "Architecture, interiors, and engineering — one accountable studio.",
    },
    {
      title: "Build-ready",
      description: "Clear documentation, coordination, and site follow-through.",
    },
  ] satisfies Strength[],
  directorName: "Oday Abu Doha",
  directorRole: "Founder & Design Director",
  directorPortrait,
  directorPortraitAlt:
    "Oday Abu Doha, founder and design director of OD Architects, in formal attire",
};
