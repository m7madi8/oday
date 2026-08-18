/** Curated interior case-study copy keyed by gallery order (01–36). */
export interface InteriorProjectDetails {
  orderLabel: string;
  name: string;
  projectType: string;
  location: string;
  year: string;
  area: string;
  concept: string;
  styleMaterials: string;
}

export const interiorProjectDetailsByOrder: Record<string, InteriorProjectDetails> = {
  "01": {
    orderLabel: "01",
    name: "Give Palestine Association Offices",
    projectType: "Office Interior Design",
    location: "Ramallah, Palestine",
    year: "2025",
    area: "85 m²",
    concept:
      "A bright and efficient office interior designed to support teamwork, focused work, and visitor reception within a compact footprint. Transparent glass partitions maintain visual connectivity between the work areas, while a welcoming lounge, integrated storage, and carefully placed greenery create a professional yet comfortable atmosphere.",
    styleMaterials:
      "Contemporary minimalist style with white walls and furniture, light wood finishes, clear glass partitions, gray porcelain flooring, black linear lighting, yellow accent seating, acoustic ceiling panels, indoor plants, and soft neutral textiles.",
  },
  "02": {
    orderLabel: "02",
    name: "Living Room",
    projectType: "Neoclassical Interior Design",
    location: "Ramallah, Palestine",
    year: "2017",
    area: "110 m²",
    concept:
      "A bright and elegant open-plan interior designed to unite the living room, dining area, and kitchen within one cohesive space. The design balances classical detailing with contemporary functionality, using a refined neutral palette, integrated storage, and carefully layered lighting to create a comfortable and sophisticated atmosphere.",
    styleMaterials:
      "Neoclassical style with white panelled cabinetry, decorative wall mouldings, marble-effect surfaces, light stone or porcelain flooring, glass-front display cabinets, black metal accents, soft gray curtains, navy upholstery, sculptural lighting fixtures, and warm concealed LED lighting.",
  },
  "03": {
    orderLabel: "03",
    name: "Living Room and Kitchen",
    projectType: "Modern Interior Design",
    location: "Ramallah, Palestine",
    year: "2024",
    area: "110 m²",
    concept:
      "A contemporary open-plan interior that integrates the living room and kitchen into a cohesive and functional family space. The design uses furniture arrangement, custom built-in storage, and carefully framed sightlines to create clear zones while maintaining visual continuity, comfort, and a welcoming atmosphere.",
    styleMaterials:
      "Modern minimalist style with a warm neutral palette, natural wood finishes, matte white cabinetry, marble-effect porcelain flooring, textured wall panels, black metal accents, soft upholstered furniture, decorative shelving, indoor greenery, and layered recessed and concealed LED lighting.",
  },
  "04": {
    orderLabel: "04",
    name: "5 Stars Salon",
    projectType: "Modern Barber Shop",
    location: "Ramallah, Palestine",
    year: "2020",
    area: "45 m²",
    concept:
      "A vibrant and highly branded barber shop designed to maximize functionality within a compact space. The layout organizes barber stations, hair-washing areas, product displays, reception, and a comfortable waiting zone around a clear central circulation path, creating an energetic and memorable customer experience.",
    styleMaterials:
      "Contemporary urban style with deep green fluted wall panels, white surfaces, black marble-effect counters, gold and lime-green accents, illuminated arched niches, large mirrors, black-and-gold barber chairs, LED strip lighting, sculptural ring pendants, and bold branded graphics.",
  },
  "05": {
    orderLabel: "05",
    name: "BatOol Beauty Center",
    projectType: "Beauty Center Interior Design",
    location: "Jerusalem",
    year: "2019",
    area: "100 m²",
    concept:
      "A playful and feminine beauty center designed to create a welcoming, memorable, and highly branded customer experience. The layout combines a reception desk, makeup stations, product display areas, comfortable waiting spaces, and a dedicated photo backdrop, using soft curves and pastel tones to create a cohesive and inviting atmosphere.",
    styleMaterials:
      "Contemporary feminine style with pastel pink and white finishes, ribbed wall panels, curved architectural details, light wood-look flooring, white cabinetry, black metal display frames, upholstered seating in pink and mint tones, decorative floral installations, sculptural furniture, and bright integrated LED lighting.",
  },
  "06": {
    orderLabel: "06",
    name: "COCO NAILS & BEAUTY",
    projectType: "Modern Nail and Beauty Salon",
    location: "Ramallah, Palestine",
    year: "2025",
    area: "55 m²",
    concept:
      "A warm and elegant beauty salon designed to create a calm, welcoming, and luxurious experience within a compact space. The layout organizes manicure and pedicure stations around a softly curved platform, while a comfortable waiting area and carefully framed views enhance the sense of relaxation and privacy.",
    styleMaterials:
      "Contemporary soft-minimalist style with a warm neutral palette, ivory textured walls, cream-colored upholstery, light wood paneling, curved furniture, matte black fixtures, large arched windows, soft sheer curtains, decorative vases, natural dried plants, and warm linear lighting",
  },
  "08": {
    orderLabel: "08",
    name: "Dr abded elkader Clinic",
    projectType: "Physiotherapy Clinic",
    location: "Ramallah, Palestine",
    year: "2025",
    area: "56 m²",
    concept:
      "A compact and calming physiotherapy clinic designed to support both clinical treatment and patient comfort. The layout integrates a treatment area, consultation desk, exercise equipment, and organized storage within a clear and efficient plan, while natural light and soft visual details create a welcoming therapeutic environment.",
    styleMaterials:
      "Contemporary soft-minimalist style with a warm neutral color palette, light wood cabinetry, white and beige wall finishes, marble-effect textured panels, built-in shelving, curved reception elements, large mirrors, soft upholstered furniture, concealed LED lighting, and colorful therapeutic equipment as visual accents.",
  },
  "09": {
    orderLabel: "09",
    name: "Dr. Amal Duaibes Dental Clinic",
    projectType: "Dental Clinic Interior Design",
    location: "Ramallah, Palestine",
    year: "2026",
    area: "100 m²",
    concept:
      "A clean and calming dental clinic designed to combine efficient clinical functionality with a comfortable patient experience. The layout organizes treatment areas, storage, and reception spaces within a bright and visually connected interior, while soft curves, natural light, and warm details help create a reassuring atmosphere.",
    styleMaterials:
      "Contemporary minimalist style with a white and warm neutral palette, seamless white cabinetry, marble-effect wall panels, light porcelain flooring, clear glass partitions, soft beige curtains, rounded ceiling details, black accents, integrated storage, and concealed LED lighting.",
  },
  "11": {
    orderLabel: "11",
    name: "RYA Clinic",
    projectType: "Physiotherapy Clinic",
    location: "Ramallah, Palestine",
    year: "2026",
    area: "62 m²",
    concept:
      "A warm and welcoming physiotherapy clinic designed to combine functional treatment spaces with a comfortable patient experience. The layout integrates a reception area, treatment room, exercise equipment, and consultation spaces within a compact plan, while curved architectural details and natural light create a calm and reassuring atmosphere.",
    styleMaterials:
      "Contemporary soft-minimalist style with warm beige and white finishes, curved wall niches, light wood accents, marble-effect porcelain flooring, white built-in storage, soft upholstered furniture, green branding details, sheer curtains, and warm concealed LED lighting.",
  },
  "17": {
    orderLabel: "17",
    name: "LEEN Medical",
    projectType: "Office Interior Design",
    location: "Ramallah, Palestine",
    year: "2023",
    area: "140 m²",
    concept:
      "A modern medical office designed to create a professional, efficient, and visually connected workplace. Transparent glass partitions with integrated blinds provide privacy while maintaining natural light and visual continuity, allowing the offices, meeting areas, and circulation spaces to function as one cohesive environment.",
    styleMaterials:
      "Contemporary professional style with white walls, light wood doors and wall panels, black-framed glass partitions, integrated horizontal blinds, large porcelain floor tiles, dark gray accents, warm wood cabinetry, built-in shelving, black track lighting, and indoor greenery.",
  },
  "18": {
    orderLabel: "18",
    name: "KOOKH",
    projectType: "Rural Cottage",
    location: "Ramallah, Palestine",
    year: "2018",
    area: "210 m²",
    concept:
      "A warm rural cottage designed as a peaceful retreat that celebrates natural materials, generous volumes, and the comfort of traditional living. The interior is organized around a central stone fireplace, with an open living area, a cozy bedroom, and carefully framed views that enhance the connection with the surrounding landscape.",
    styleMaterials:
      "Rustic contemporary style with natural stone walls, reclaimed wood wall and ceiling finishes, exposed structural beams, warm timber flooring, a traditional stone fireplace, wrought-iron lighting fixtures, woven textiles, soft neutral upholstery, and handcrafted decorative elements.",
  },
  "21": {
    orderLabel: "21",
    name: "Master Bedroom",
    projectType: "Modern Bohemian Interior Design",
    location: "Ramallah, Palestine",
    year: "2018",
    area: "210 m²",
    concept:
      "A warm and atmospheric master bedroom designed as a private retreat that combines comfort, natural textures, and a relaxed bohemian character. The space integrates the sleeping area with a cozy lounge corner and dressing zone, while curved partitions, woven screens, and soft lighting create a sense of intimacy and visual harmony.",
    styleMaterials:
      "Modern Bohemian style with earthy beige and brown tones, textured plaster walls, natural wood ceiling beams, woven cane panels, warm timber flooring, exposed stone walls, soft linen bedding, layered rugs, rattan pendant lights, sculptural wall sconces, and concealed indirect lighting.",
  },
};
