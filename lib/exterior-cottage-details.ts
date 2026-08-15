/** Curated cottage case-study copy keyed by gallery order (01–04). */
export interface CottageProjectDetails {
  orderLabel: string;
  name: string;
  projectType: string;
  location: string;
  year: string;
  area: string;
  concept: string;
  styleMaterials: string;
}

export const cottageProjectDetailsByOrder: Record<string, CottageProjectDetails> = {
  "01": {
    orderLabel: "01",
    name: "COTTAGE 1",
    projectType: "Cottage",
    location: "Not specified",
    year: "2019",
    area: "380 m²",
    concept:
      "A charming cottage designed to blend naturally with its sloped landscape through a warm, human-scaled composition. The project combines pitched-roof volumes, welcoming terraces, and landscaped outdoor spaces to create a peaceful retreat with a strong connection to its surroundings.",
    styleMaterials:
      "Rustic Mediterranean style with light natural stone façades, dark pitched-tile roofs, warm wood trim, arched windows and doors, dark metal railings, stone retaining walls, traditional lanterns, and carefully landscaped gardens.",
  },
  "02": {
    orderLabel: "02",
    name: "ADAM'S COTTAGE",
    projectType: "Cottage",
    location: "Surda, Ramallah, Palestine",
    year: "2021",
    area: "50 m²",
    concept:
      "A contemporary garden cottage designed as a private retreat immersed in nature. The compact pavilion opens onto a landscaped courtyard with a sunken outdoor seating area, creating a seamless connection between the interior spaces, the garden, and the surrounding landscape.",
    styleMaterials:
      "Contemporary minimalist style with natural stone walls, warm wood cladding, a low-profile roof, expansive glass openings, dark metal frames, integrated linear lighting, landscaped gardens, and a sunken outdoor lounge with a central fire feature.",
  },
  "03": {
    orderLabel: "03",
    name: "GEORGE COTTAGE",
    projectType: "Cottage",
    location: "Ramallah, Palestine",
    year: "2022",
    area: "390 m²",
    concept:
      "A warm and inviting cottage designed to blend naturally with its wooded setting and sloped landscape. The composition combines stone-clad volumes, pitched roofs, generous terraces, and large glazed openings to create a comfortable retreat with strong visual and physical connections to the surrounding garden.",
    styleMaterials:
      "Contemporary rustic style with natural stone façades, dark pitched-tile roofs, timber roof trim, expansive glass gables, dark metal railings, deep overhangs, stone retaining walls, landscaped gardens, and carefully integrated outdoor seating areas.",
  },
  "04": {
    orderLabel: "04",
    name: "MAJED'S COTTAGE",
    projectType: "Cottage",
    location: "Ramallah, Palestine",
    year: "2022",
    area: "105 m²",
    concept:
      "A compact contemporary cottage designed as a peaceful retreat within a landscaped natural setting. The project uses a dynamic roof profile, double-height glazed spaces, and elevated outdoor terraces to create a sense of openness and maximize the connection with the surrounding garden.",
    styleMaterials:
      "Contemporary rustic style with light natural stone walls, dark metal roof edges, large glass openings, black metal structural details, glass balcony railings, a stone fireplace, landscaped gardens, and a shaded outdoor pergola.",
  },
};
