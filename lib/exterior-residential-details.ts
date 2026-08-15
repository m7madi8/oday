/**
 * Residential building case-study copy.
 * Site folder order (alphabetical) maps to content numbers: 01, 03, 02, 04, 05, 06, 07
 */
export interface ResidentialBuildingDetails {
  orderLabel: string;
  name: string;
  projectType: string;
  location: string;
  year: string;
  area: string;
  concept: string;
  styleMaterials: string;
}

/** Content keyed by the client's case numbers. */
export const residentialBuildingDetailsByOrder: Record<string, ResidentialBuildingDetails> = {
  "01": {
    orderLabel: "01",
    name: "R I 01",
    projectType: "Residential Building",
    location: "Jaljulia",
    year: "2026",
    area: "785 m²",
    concept:
      "A contemporary residential building designed with a clear vertical composition and a balanced contrast between light and dark volumes. Repeated balconies, generous openings, and integrated greenery create comfortable outdoor spaces for residents while adding rhythm and depth to the façade.",
    styleMaterials:
      "Modern minimalist style with light plastered façades, dark textured cladding, warm wood soffits, glass balcony railings, large windows, black metal details, landscaped balconies, and integrated architectural lighting.",
  },
  "02": {
    orderLabel: "02",
    name: "R. LINE",
    projectType: "Residential Building",
    location: "Birzeit, Palestine",
    year: "2017",
    area: "1,850 m²",
    concept:
      "A contemporary residential development composed of several buildings arranged around shared pedestrian spaces, landscaped areas, and dedicated parking. The design creates a unified community through consistent architectural language, private balconies, rooftop terraces, and carefully planned circulation between the buildings.",
    styleMaterials:
      "Modern minimalist style with white plastered façades, warm wood accents, glass balcony railings, decorative perforated screens, horizontal shading elements, large windows, landscaped courtyards, and integrated exterior lighting.",
  },
  "03": {
    orderLabel: "03",
    name: "ARANKI -1-",
    projectType: "Residential Building",
    location: "Birzeit, Ramallah, Palestine",
    year: "2025",
    area: "1,400 m²",
    concept:
      "A contemporary residential building designed with a strong vertical presence and a refined sequence of curved balconies. The design combines generous openings, private outdoor spaces, and integrated greenery to create comfortable apartments while adding depth, rhythm, and elegance to the façade.",
    styleMaterials:
      "Contemporary style with light natural stone façades, dark charcoal-colored horizontal bands, curved balcony edges, glass railings, black metal screens, warm wood ceiling accents, large glazed openings, and integrated LED lighting.",
  },
  "04": {
    orderLabel: "04",
    name: "Aranki -1-",
    projectType: "Residential Building",
    location: "Birzeit, Ramallah, Palestine",
    year: "2025",
    area: "2,026 m²",
    concept:
      "A contemporary mixed-use residential building designed to combine comfortable apartments with active commercial spaces at street level. The building creates a strong urban presence through a clear vertical composition, generous balconies, landscaped terraces, and inviting ground-floor uses that connect the project to the surrounding community.",
    styleMaterials:
      "Contemporary style with light stone or plastered façades, dark gray horizontal cladding, geometric and curved balconies, glass railings, black metal details, warm wood soffits, large glazed openings, landscaped areas, and integrated architectural lighting.",
  },
  "05": {
    orderLabel: "05",
    name: "L. J",
    projectType: "Classical Residential Building",
    location: "Birzeit, Ramallah, Palestine",
    year: "2026",
    area: "2,650 m²",
    concept:
      "A classical residential building designed with a strong symmetrical composition, elegant proportions, and a refined connection between residential and commercial functions. The façade is organized around a central architectural bay, generous balconies, and a welcoming ground-floor frontage, creating a distinguished urban presence.",
    styleMaterials:
      "Classical style with natural stone façades, decorative pilasters, cornices, pediments, arched openings, ornate wrought-iron railings, large glazed windows, warm exterior lighting, and carefully detailed retail entrances at ground level.",
  },
  "06": {
    orderLabel: "06",
    name: "R. HEBRON",
    projectType: "Residential Building",
    location: "Hebron, Palestine",
    year: "2022",
    area: "860 m²",
    concept:
      "A contemporary residential building designed with a dynamic interplay of solid volumes and open terraces. The design features prominent wood-textured frames that highlight specific balconies, creating a rhythmic and modern façade. Integrated greenery and layered outdoor spaces enhance the living experience and connect the building with its surroundings.",
    styleMaterials:
      "Modern minimalist style with white stone façades, wood-textured accent frames, glass balcony railings, black metal details, and integrated planters for greenery.",
  },
  "07": {
    orderLabel: "07",
    name: "A.B BUILDING",
    projectType: "Residential Building",
    location: "Jaljulia",
    year: "2026",
    area: "800 m²",
    concept:
      "A contemporary residential building designed with a clear vertical composition, generous balconies, and carefully framed openings. The project combines private outdoor spaces with integrated greenery and a welcoming ground-floor entrance, creating a strong architectural presence while maintaining comfort and privacy for its residents.",
    styleMaterials:
      "Modern minimalist style with light stone or plastered façades, dark textured accents, curved and projecting balconies, glass railings, black metal details, wood-look soffits, large glazed openings, landscaped areas, and warm integrated lighting.",
  },
  "08": {
    orderLabel: "08",
    name: "HAG 1213",
    projectType: "Residential Building",
    location: "Jaljulia",
    year: "2026",
    area: "1,320 m²",
    concept:
      "A contemporary residential building designed as a refined composition of stepped volumes, generous balconies, and carefully framed vertical openings. The project creates comfortable outdoor spaces for each residence through planted balconies and terraces, while the landscaped edges and transparent ground floor establish a welcoming connection with the surrounding streetscape.",
    styleMaterials:
      "Modern minimalist style with light natural stone façades, charcoal-gray cladding, warm wood accents, curved and projecting balconies, glass railings, large glazed openings, black metal details, landscaped planters, rooftop terraces, and warm integrated lighting.",
  },
};

/**
 * Alphabetical folder index → client case number.
 * Current site order is: 1, 3, 2, 4, 5, 6, then 7, 8.
 */
export const residentialBuildingFolderOrderLabels = [
  "01",
  "03",
  "02",
  "04",
  "05",
  "06",
  "07",
  "08",
] as const;
