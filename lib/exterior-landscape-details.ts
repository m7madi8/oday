/** Curated landscape case-study copy keyed by gallery order (01–07). */
export interface LandscapeProjectDetails {
  orderLabel: string;
  name: string;
  projectType: string;
  location: string;
  year: string;
  area: string;
  concept: string;
  styleMaterials: string;
}

export const landscapeProjectDetailsByOrder: Record<string, LandscapeProjectDetails> = {
  "01": {
    orderLabel: "01",
    name: "KHALAF",
    projectType: "Landscape Design",
    location: "Ramallah, Palestine",
    year: "2023",
    area: "120 m²",
    concept:
      "A refined landscape design centered around a circular outdoor pavilion that serves as a welcoming social space. The layout combines geometric pathways, carefully arranged planting beds, lawn areas, and private seating zones to create a balanced and elegant outdoor environment connected to the surrounding residence.",
    styleMaterials:
      "Classical contemporary style with white rendered walls, ornamental columns, a circular pergola, warm wood ceiling finishes, natural stone paving, white concrete stepping slabs, timber and metal fencing, decorative gates, manicured planting, and integrated landscape lighting.",
  },
  "02": {
    orderLabel: "02",
    name: "KHALAF",
    projectType: "Landscape Design",
    location: "Ramallah, Palestine",
    year: "2023",
    area: "120 m²",
    concept:
      "A contemporary landscape design centered around a sheltered outdoor living pavilion. The layout combines geometric pathways, a manicured lawn, planted borders, and comfortable seating areas to create a private and welcoming garden that extends the living spaces into the outdoors.",
    styleMaterials:
      "Contemporary style with a dark metal pergola, warm wood slats, large concrete stepping slabs, white rendered boundary walls, timber and metal fencing, ornamental planting, lawn areas, and integrated outdoor lighting.",
  },
  "03": {
    orderLabel: "03",
    name: "AL-BAZZAR",
    projectType: "Booth's",
    location: "Ramallah, Palestine",
    year: "2026",
    area: "35 m²",
    concept:
      "A vibrant collection of modular commercial booths designed to create an engaging pedestrian destination for food, beverage, and retail activities. The project combines compact service units with rooftop terraces, outdoor seating, and landscaped public areas, encouraging social interaction and extending the customer experience beyond the booth interiors.",
    styleMaterials:
      "Contemporary commercial style with bold yellow, red, and blue façades, rounded corners, black metal frames, large service openings, glass railings, rooftop pergolas, outdoor umbrellas, colorful signage, concrete paving, and integrated landscape planting.",
  },
  "04": {
    orderLabel: "04",
    name: "Khan Al-Ahmar School",
    projectType: "School Design Competition",
    location: "Khan Al-Ahmar, Jericho, Palestine",
    year: "2023",
    area: "500 m²",
    concept:
      "A community-oriented school designed to respond to the desert environment and the educational needs of the local community. The proposal organizes classrooms and shared facilities around shaded courtyards, with covered walkways, a central gathering space, and an integrated sports field that supports learning, play, and community activities.",
    styleMaterials:
      "Climate-responsive contemporary style using lightweight school buildings, shaded bamboo or reed canopies, simple pitched roofs, natural and earthy finishes, photovoltaic panels, landscaped courtyards, recycled-tire seating elements, and durable sports-surface materials.",
  },
  "05": {
    orderLabel: "05",
    name: "MOE",
    projectType: "Landscape Design",
    location: "Al Ram, Palestine",
    year: "2021",
    area: "140 m²",
    concept:
      "A formal residential landscape design organized around a sequence of landscaped courtyards, shaded walkways, and outdoor seating areas. The layout creates a welcoming transition from the street to the residence while balancing privacy, greenery, circulation, and comfortable spaces for outdoor living.",
    styleMaterials:
      "Classical contemporary style with white rendered boundary walls, decorative columns, traditional cornices, black metal gates and railings, light stone paving, geometric planting beds, manicured lawns, ornamental trees, potted plants, and warm outdoor lighting.",
  },
  "06": {
    orderLabel: "06",
    name: "Nepal School",
    projectType: "School Design Competition · Semi-Finalist",
    location: "Nepal",
    year: "2024",
    area: "820 m²",
    concept:
      "A community-oriented school campus organized as a collection of small learning pavilions around a central courtyard. The design integrates classrooms, play areas, sports facilities, gardens, and shaded circulation spaces to create an engaging and inclusive learning environment that encourages interaction, exploration, and outdoor education.",
    styleMaterials:
      "Colorful contemporary style with exposed brick walls, vibrant painted façades, pitched metal roofs, timber roof structures, colorful louvered shutters, concrete columns, covered walkways, planted courtyards, murals, and playful outdoor elements.",
  },
  "07": {
    orderLabel: "07",
    name: "LANDSCAPE",
    projectType: "Landscape Design",
    location: "Ramallah, Palestine",
    year: "2018",
    area: "350 m²",
    concept:
      "A refined residential landscape design organized around a sequence of outdoor living spaces, water features, and lush planting areas. The design creates a tranquil garden experience through a curved pedestrian path, layered planting beds, a swimming pool, shaded seating, and carefully framed views toward the residence.",
    styleMaterials:
      "Classical contemporary style with natural stone retaining walls, white rendered planters, light stone paving, blue mosaic pool finishes, timber pergolas, ornamental shrubs, palms, flowering plants, manicured lawns, and integrated water features.",
  },
};
