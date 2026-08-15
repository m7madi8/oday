/** Curated villa case-study copy keyed by gallery order (01–12). */
export interface VillaProjectDetails {
  orderLabel: string;
  name: string;
  projectType: string;
  location: string;
  year: string;
  area: string;
  concept: string;
  styleMaterials: string;
}

export const villaProjectDetailsByOrder: Record<string, VillaProjectDetails> = {
  "01": {
    orderLabel: "01",
    name: "Villa R.H",
    projectType: "Residential Villa",
    location: "Ramallah, Palestine",
    year: "2018",
    area: "650 m²",
    concept:
      "A spacious family villa designed around generous terraces, layered outdoor spaces, and strong indoor–outdoor connections. The design combines formal architectural details with a comfortable contemporary lifestyle.",
    styleMaterials:
      "Contemporary classical style with white stone façades, dark metal railings, large windows, wooden pergolas, and light-colored paving.",
  },
  "02": {
    orderLabel: "02",
    name: "B.H 1 Villa",
    projectType: "Residential Villa",
    location: "Ramallah, Palestine",
    year: "2023",
    area: "630 m²",
    concept:
      "A contemporary villa designed with strong geometric forms, carefully framed openings, and a clear connection between the indoor and outdoor spaces. The layered volumes and integrated lighting create a refined and welcoming residential environment.",
    styleMaterials:
      "Contemporary minimalist style with concrete surfaces, dark textured façades, light stone or plaster finishes, black metal details, glass openings, and warm architectural lighting.",
  },
  "03": {
    orderLabel: "03",
    name: "DR BAHA Villa",
    projectType: "Residential Villa",
    location: "Ramallah, Palestine",
    year: "2020",
    area: "420 m²",
    concept:
      "A modern family villa designed with a balanced composition of solid volumes, spacious terraces, and generous glazed openings. The design creates a bright and welcoming living environment while maintaining privacy and a strong connection with the surrounding landscape.",
    styleMaterials:
      "Contemporary style with white plastered façades, dark gray accents, natural stone cladding, glass openings, metal details, and landscaped outdoor areas.",
  },
  "04": {
    orderLabel: "04",
    name: "V Villa",
    projectType: "Residential Villa",
    location: "Ramallah, Palestine",
    year: "2021",
    area: "535 m²",
    concept:
      "A contemporary villa designed to respond to its sloped site through a dynamic arrangement of terraces, balconies, and open outdoor spaces. The design creates a strong connection with the surrounding landscape while offering privacy, natural light, and comfortable living spaces.",
    styleMaterials:
      "Contemporary minimalist style with white plastered façades, natural stone retaining walls, dark metal railings, wooden ceiling details, large glass openings, and warm integrated lighting.",
  },
  "05": {
    orderLabel: "05",
    name: "HOUSE OF SUN",
    projectType: "Residential Villa",
    location: "Ramallah, Palestine",
    year: "2022",
    area: "680 m²",
    concept:
      "A distinctive villa inspired by Mediterranean architectural principles, designed around a sequence of courtyards, terraces, and outdoor living spaces. The composition emphasizes privacy, natural light, and a harmonious relationship between the building, landscape, and surrounding stone walls. Arched openings and soft architectural lighting create a warm and welcoming atmosphere.",
    styleMaterials:
      "Contemporary Mediterranean style with white plastered façades, arched openings, natural stone walls, decorative screens, curved terraces, integrated warm lighting, landscaped gardens, and carefully designed outdoor seating areas.",
  },
  "06": {
    orderLabel: "06",
    name: "420 I Villa",
    projectType: "Residential Villa",
    location: "Jaljuliya",
    year: "2025",
    area: "395 m²",
    concept:
      "A contemporary villa defined by bold geometric volumes, deep recessed balconies, and a strong contrast between solid façades and open spaces. The design creates a private and welcoming residence through carefully framed views, layered terraces, and warm integrated lighting.",
    styleMaterials:
      "Modern minimalist style with dark gray cladding, light concrete or plastered surfaces, wood-textured wall finishes, large glass openings, black metal details, and warm architectural lighting.",
  },
  "07": {
    orderLabel: "07",
    name: "Twins' Villas",
    projectType: "Twins' Residential Villas",
    location: "Jericho, Palestine",
    year: "2017",
    area: "440 m²",
    concept:
      "A symmetrical twin-villa project organized around a central axis and a shared landscaped entrance. The design creates two harmonious residential units with balanced proportions, curved balconies, generous outdoor spaces, and a strong sense of connection between the architecture and the surrounding landscape.",
    styleMaterials:
      "Contemporary style with light-colored stone or plastered façades, dark roof edges, curved glass balconies, wood accents, large glazed openings, landscaped courtyards, and carefully designed outdoor seating areas.",
  },
  "08": {
    orderLabel: "08",
    name: "SAHER RESIDENCE",
    projectType: "Residential Villa",
    location: "Ramallah, Palestine",
    year: "2018",
    area: "840 m²",
    concept:
      "A spacious multi-level residence designed to maximize views, natural light, and outdoor living. The building is organized through a series of terraces and balconies that create a strong connection between the interior spaces, the surrounding landscape, and the outdoor areas.",
    styleMaterials:
      "Contemporary classical style with white stone façades, decorative cornices, wide balconies, dark metal railings, large windows, wooden pergola details, and landscaped outdoor spaces.",
  },
  "09": {
    orderLabel: "09",
    name: "VILLA MODERNE",
    projectType: "Residential Villa",
    location: "Ramallah, Palestine",
    year: "2019",
    area: "460 m²",
    concept:
      "A contemporary villa organized around a private landscaped courtyard that serves as the heart of the home. The design emphasizes indoor–outdoor living through open terraces, shaded seating areas, and carefully framed views, creating a calm and comfortable residential environment.",
    styleMaterials:
      "Modern minimalist style with white plastered façades, clean geometric volumes, perforated decorative screens, large glass openings, concrete surfaces, wooden pergola elements, dark metal details, and landscaped gardens.",
  },
  "10": {
    orderLabel: "10",
    name: "V I V",
    projectType: "Residential Villa",
    location: "Kfar Qasim",
    year: "2025",
    area: "185 m²",
    concept:
      "A compact contemporary villa designed through a dynamic composition of interlocking volumes, elevated living spaces, and open terraces. The design responds to the surrounding natural setting while maximizing privacy, natural light, and functional outdoor areas. Integrated parking beneath the building and rooftop terraces enhance the efficiency of the compact site.",
    styleMaterials:
      "Modern minimalist style with white and charcoal-gray façades, clean geometric forms, large glazed openings, black metal railings, wooden pergola elements, textured plaster finishes, and warm integrated lighting.",
  },
  "11": {
    orderLabel: "11",
    name: "V I 12",
    projectType: "Multi-Level Residential Villa",
    location: "Kfar Qasim",
    year: "2025",
    area: "460 m²",
    concept:
      "A contemporary multi-level villa designed through a dynamic composition of intersecting volumes, layered balconies, and strong vertical elements. The design combines privacy with openness, using generous glazing, shaded outdoor spaces, and a clearly defined relationship between the interior and exterior areas.",
    styleMaterials:
      "Modern minimalist style with white plastered façades, dark marble-effect cladding, warm wood accents, vertical screens, glass balcony railings, black metal details, and integrated architectural lighting.",
  },
  "12": {
    orderLabel: "12",
    name: "B.H Villa",
    projectType: "Residential Villa",
    location: "Ramallah, Palestine",
    year: "2026",
    area: "780 m²",
    concept:
      "A luxurious contemporary villa designed as a series of layered volumes that respond to the sloped site. The composition combines generous terraces, framed views, private outdoor spaces, and a carefully integrated water feature. Decorative screens and deep overhangs provide privacy and shade while enhancing the architectural identity of the residence.",
    styleMaterials:
      "Contemporary luxury style with light natural stone façades, dark textured cladding, large glass openings, geometric metal screens, glass railings, wood ceiling details, sculptural water features, landscaped terraces, and warm integrated lighting.",
  },
};
