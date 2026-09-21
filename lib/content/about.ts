import directorPortrait from "@/imgs/1000243364.jpg";
import directorSignature from "@/imgs/oday-signature.png";

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
  contactEyebrow: "Architect & Founder",
  directorRole: "Founder & Principal Architect",
  directorPortrait,
  directorPortraitAlt:
    "Oday Abu Doha, architect and founder of OD Architects",
  directorSignature,
};
