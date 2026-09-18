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
    name: "Pizzeria Marzano – Italian Pizzeria & Restaurant",
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
    name: "Vanilla Lingerie – Women’s Lingerie and Fashion Store",
    projectType: "Beauty Center Interior Design",
    location: "Jerusalem",
    year: "2019",
    area: "100 m²",
    concept:
      "A playful and feminine beauty center designed to create a welcoming, memorable, and highly branded customer experience. The layout combines a reception desk, makeup stations, product display areas, comfortable waiting spaces, and a dedicated photo backdrop, using soft curves and pastel tones to create a cohesive and inviting atmosphere.",
    styleMaterials:
      "Contemporary feminine style with pastel pink and white finishes, ribbed wall panels, curved architectural details, light wood-look flooring, white cabinetry, black metal display frames, upholstered seating in pink and mint tones, decorative floral installations, sculptural furniture, and bright integrated LED lighting.",
  },
  "07": {
    orderLabel: "07",
    name: "Living Room",
    projectType: "Modern Interior Design",
    location: "Ramallah, Palestine",
    year: "2022",
    area: "85 m²",
    concept:
      "A contemporary open-plan living space designed to combine comfort, functionality, and visual elegance within a compact area. The living room, dining area, and kitchen are connected through a clear spatial layout, while carefully selected furniture, integrated storage, and decorative greenery create a warm and welcoming family environment.",
    styleMaterials:
      "Modern minimalist style with a neutral color palette, natural wood wall panels and cabinetry, matte charcoal kitchen finishes, marble-effect surfaces, light porcelain flooring, soft upholstered furniture, black metal details, indoor plants, and layered recessed and linear LED lighting.",
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
  "10": {
    orderLabel: "10",
    name: "R Centre",
    projectType: "Modern Medical Center Interior Design",
    location: "Ramallah, Palestine",
    year: "2024",
    area: "125 m²",
    concept:
      "A modern medical center designed to provide an efficient, reassuring, and patient-centered environment. The layout combines a welcoming reception area, organized waiting spaces, and specialized treatment rooms, while clear circulation, visual connectivity, and carefully integrated medical equipment support a functional and comfortable experience.",
    styleMaterials:
      "Contemporary medical style with a clean white and blue color palette, textured stone-effect wall panels, ribbed wall surfaces, white reception counters, light gray flooring, warm wood accents, natural planting, blue privacy curtains, integrated signage, and geometric LED lighting.",
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
  "12": {
    orderLabel: "12",
    name: "DR SALAH BADAHA",
    projectType: "Modern Interior Design",
    location: "Ramallah, Palestine",
    year: "2025",
    area: "180 m²",
    concept:
      "A refined modern interior designed around an open-plan living, dining, and kitchen area, creating a seamless and welcoming family environment. The design emphasizes spaciousness, visual continuity, and natural light through a double-height volume, an open staircase, and carefully integrated architectural features. A central fireplace and entertainment wall form the focal point of the living area, while the kitchen and dining spaces remain visually connected.",
    styleMaterials:
      "Contemporary minimalist style with warm beige and off-white tones, natural wood wall cladding, marble-effect surfaces, large-format light flooring, black metal staircase details, glass balustrades, soft upholstered furniture, sheer curtains, indoor greenery, sculptural artwork, a linear fireplace, and layered recessed and concealed LED lighting.",
  },
  "13": {
    orderLabel: "13",
    name: "Donut's Shop – Icon Mall",
    projectType: "Café and Dessert Shop Interior Design",
    location: "Icon Mall, Ramallah, Palestine",
    year: "2025",
    area: "55 m²",
    concept:
      "A playful and inviting donut and coffee shop designed to create a memorable customer experience within a compact retail space. The layout places the service counter and display cases at the center, supported by an efficient coffee preparation area and intimate seating zones. A colorful visual identity, curved forms, and playful decorative elements reinforce the shop’s cheerful dessert-focused character.",
    styleMaterials:
      "Contemporary playful style with pastel pink and light blue finishes, terrazzo-effect surfaces, fluted counter panels, rounded corners, black metal details, glass display cases, light wood shelving, decorative donut elements, graphic menu boards, soft pendant lighting, and integrated LED accents.",
  },
  "14": {
    orderLabel: "14",
    name: "BatOol Beauty Center",
    projectType: "Commercial Retail Project / Interior Design",
    location: "City Mall, Ramallah, Palestine",
    year: "2023",
    area: "100 m²",
    concept:
      "A bold and feminine retail interior designed to create an engaging and elegant shopping experience. The layout combines clearly organized product displays, central merchandising islands, fitting areas, and a welcoming reception zone, allowing customers to move comfortably through the store while keeping the collections visually accessible.",
    styleMaterials:
      "Contemporary fashion retail style with a strong pink-and-white color palette, illuminated arched display niches, white shelving and cabinetry, glossy light-colored flooring, black exposed ceiling services, linear LED lighting, mannequins, glass display elements, and carefully integrated branding graphics.",
  },
  "15": {
    orderLabel: "15",
    name: "Bridal Boutique & Fashion Showroom",
    projectType: "Bridal Gown Showroom",
    location: "Icon Mall, Ramallah, Palestine",
    year: "2020",
    area: "430 m²",
    concept:
      "An elegant bridal showroom designed to transform gown shopping into a memorable and luxurious experience. The spacious layout combines curated bridal displays, fashion racks, reception areas, and raised presentation platforms, allowing each gown to be viewed as a statement piece while guiding visitors through a refined and visually engaging journey.",
    styleMaterials:
      "Contemporary luxury style with a white and charcoal color palette, glossy light-colored flooring, dark marble-effect feature walls, curved architectural forms, illuminated display niches, sculptural stair platforms, gold accents, glass elements, wave-like ceiling details, decorative greenery, and layered ambient and accent lighting.",
  },
  "16": {
    orderLabel: "16",
    name: "Dr. Mays Zein Dental Clinic",
    projectType: "Modern Dental Clinic Interior Design",
    location: "Ramallah, Palestine",
    year: "2024",
    area: "55 m²",
    concept:
      "A compact and welcoming dental clinic designed to combine professional functionality with a reassuring patient experience. The layout integrates reception, waiting, treatment, and support areas within an efficient plan, while transparent partitions, soft curves, and carefully controlled lighting create a bright and calming environment.",
    styleMaterials:
      "Contemporary minimalist style with a white and light-gray palette, soft lavender accents, glossy white cabinetry, glass partitions, smooth curved wall details, gray porcelain flooring, black-framed doors, pink upholstered seating, dental equipment, decorative dried plants, and circular and concealed LED lighting.",
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
  "19": {
    orderLabel: "19",
    name: "Howida Modern Luxury Villa",
    projectType: "Luxury Residence Interior Design",
    location: "Ramallah, Palestine",
    year: "2026",
    area: "220 m²",
    concept:
      "A sophisticated luxury residence designed around an open-plan sequence of living, dining, and kitchen spaces. The interior creates a strong sense of continuity and grandeur through generous glazing, a sculptural staircase, carefully framed views, and a harmonious balance between elegant entertaining areas and comfortable family spaces.",
    styleMaterials:
      "Modern luxury style with warm wood wall panels, light natural stone and marble-effect surfaces, large glass openings, dark charcoal accents, soft neutral upholstery, black and bronze furniture details, statement lighting fixtures, indoor greenery, a grand piano, a sculptural fireplace, and layered concealed LED lighting.",
  },
  "20": {
    orderLabel: "20",
    name: "Howida Contemporary Master Bedroom Suite",
    projectType: "Luxury Bedroom Suite Interior Design",
    location: "Ramallah, Palestine",
    year: "2026",
    area: "65 m²",
    concept:
      "A refined contemporary master bedroom suite designed as a calm and luxurious private retreat. The space combines a comfortable sleeping area with a dedicated dressing zone and vanity area, using curved architectural elements, layered lighting, and carefully framed views to create a sense of privacy, softness, and visual continuity.",
    styleMaterials:
      "Contemporary luxury style with warm wood wall paneling, soft beige and gray tones, marble-effect surfaces, large mirrored wardrobe doors, curved furniture and partitions, textured decorative wall panels, sheer curtains, dark metal accents, upholstered seating, and warm concealed and recessed LED lighting.",
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
  "22": {
    orderLabel: "22",
    name: "Luxury Kitchen",
    projectType: "Modern Kitchen Interior",
    location: "Ramallah, Palestine",
    year: "2026",
    area: "45 m²",
    concept:
      "A refined modern kitchen designed to combine elegant aesthetics with practical family living. The layout integrates a fully equipped cooking area, illuminated glass display cabinets, a marble island, and a connected dining space, creating a functional and welcoming environment for everyday use and social gatherings.",
    styleMaterials:
      "Contemporary luxury style with warm wood cabinetry, matte white doors, marble-effect countertops and backsplash, dark glass display cabinets, light porcelain flooring, black appliances and metal details, soft upholstered dining chairs, decorative greenery, pendant lighting, and layered recessed and concealed LED lighting.",
  },
  "25": {
    orderLabel: "25",
    name: "Contemporary Master Bedroom Suite with Walk-In Closet",
    projectType: "Modern Master Bedroom Interior Design",
    location: "Ramallah, Palestine",
    year: "2023",
    area: "50 m²",
    concept:
      "A contemporary master bedroom suite designed as a calm and highly functional private retreat. The layout integrates a comfortable sleeping area, a spacious walk-in closet, and a refined vanity zone, while the transparent wardrobe systems, integrated storage, and carefully layered lighting create a sense of openness, organization, and luxury.",
    styleMaterials:
      "Modern minimalist style with warm wood cabinetry, dark glass wardrobe fronts, black metal framing, marble-effect porcelain flooring, soft gray and beige textiles, upholstered bed and seating, illuminated shelving, mirrored surfaces, white walls, and recessed and integrated LED lighting.",
  },
  "26": {
    orderLabel: "26",
    name: "Contemporary Luxury Bathroom Suite",
    projectType: "Luxury Master Bathroom Interior Design",
    location: "Icon Mall, Ramallah, Palestine",
    year: "2025",
    area: "18 m²",
    concept:
      "A luxurious master bathroom designed as a refined and relaxing private retreat. The layout combines a spacious double vanity, integrated storage, and separate bathing areas within a compact yet elegant composition. Distinctive arches, sculptural mirrors, layered lighting, and carefully selected materials create a sophisticated and calming atmosphere.",
    styleMaterials:
      "Contemporary luxury style with dark textured stone-effect wall tiles, white marble-effect porcelain surfaces, warm wood cabinetry, matte white sanitary fixtures, brushed gold …",
  },
  "27": {
    orderLabel: "27",
    name: "Modern Medical Aesthetics Clinic",
    projectType: "Luxury Dermatology & Aesthetic Clinic Interior Design",
    location: "Ramallah, Palestine",
    year: "2026",
    area: "50 m²",
    concept:
      "A sophisticated medical aesthetics clinic designed to combine clinical efficiency with a calm and luxurious patient experience. The compact layout integrates reception, product display, consultation, and treatment areas, while softly curved architectural elements, comfortable seating, and carefully controlled lighting create a welcoming and reassuring atmosphere.",
    styleMaterials:
      "Contemporary luxury style with warm blush and neutral tones, curved plastered walls, illuminated arched display niches, white built-in shelving, light porcelain flooring, rounded upholstered furniture, sheer window curtains, integrated product displays, natural greenery, and layered concealed and decorative lighting.",
  },
  "29": {
    orderLabel: "29",
    name: "Contemporary Interior Design & Materials Showroom",
    projectType: "Luxury Tiles & Finishes Showroom",
    location: "Ramallah, Palestine",
    year: "2026",
    area: "100 m²",
    concept:
      "A sophisticated materials showroom designed to present tiles, finishes, and interior solutions within a refined and highly functional environment. The layout combines product display walls, material sample islands, consultation areas, and integrated storage, allowing visitors to explore and compare finishes in a comfortable and visually organized setting.",
    styleMaterials:
      "Contemporary luxury style with warm beige and white tones, natural wood cabinetry, dark charcoal shelving, marble- and stone-effect display panels, light porcelain flooring, decorative fluted wood screens, black metal details, sculptural furniture, and layered recessed, track, and concealed LED lighting.",
  },
  "30": {
    orderLabel: "30",
    name: "Rami Design",
    projectType: "Modern Classic Villa Interior Design",
    location: "Ramallah, Palestine",
    year: "2025",
    area: "110 m²",
    concept:
      "A refined modern classic villa interior designed to create a warm, elegant, and cohesive family environment. The open-plan layout connects the living room, dining area, and kitchen, while carefully framed wall panels, balanced furniture arrangements, and generous natural light establish a sense of harmony and sophistication throughout the space.",
    styleMaterials:
      "Modern classic style with warm beige and taupe tones, decorative wall mouldings, fluted wood panels, marble-effect surfaces, light stone flooring, soft upholstered furniture, dark metal accents, sheer curtains, sculptural pendant lights, decorative dried plants, and layered warm LED lighting.",
  },
  "31": {
    orderLabel: "31",
    name: "Saleh Master Bedroom",
    projectType: "Modern Luxury Master Bedroom Suite",
    location: "Ramallah, Palestine",
    year: "2026",
    area: "35 m²",
    concept:
      "A compact and refined master bedroom designed as a calm and luxurious private retreat. The layout combines a comfortable sleeping area with a dedicated vanity and dressing zone, while integrated storage, a full-height mirror, and carefully framed natural light create a sense of spaciousness, comfort, and visual continuity.",
    styleMaterials:
      "Modern luxury style with a soft neutral palette, white built-in wall panels, warm wood cabinetry, beige upholstered furniture, light textured flooring, marble-effect wall cladding, dark framed shelving, black metal accents, sheer curtains, and layered recessed, track, and concealed LED lighting.",
  },
  "32": {
    orderLabel: "32",
    name: "5 Stars Salon",
    projectType: "Modern Italian Pizzeria",
    location: "Ramallah, Palestine",
    year: "2026",
    area: "110 m²",
    concept:
      "A vibrant Italian pizzeria designed to create an inviting and memorable dining experience. The layout combines a welcoming seating area with an open service counter and visible pizza oven, allowing the preparation process to become part of the customer experience. The strong green identity, patterned flooring, and warm decorative details create a lively atmosphere inspired by the character of traditional Italian cafés.",
    styleMaterials:
      "Contemporary Italian style with deep green wall and window frames, handcrafted green ceramic tiles, patterned encaustic-style floor tiles, white walls, dark exposed ceiling beams, natural rattan and cane seating, copper pendant lights, a traditional pizza oven, white solid-surface counters, black metal details, and decorative flowering branches.",
  },
  "34": {
    orderLabel: "34",
    name: "Jad Sport",
    projectType: "Sportswear & Footwear Showroom",
    location: "Icon Mall, Ramallah, Palestine",
    year: "2025",
    area: "35 m²",
    concept:
      "A dynamic and highly branded sportswear showroom designed to maximize product visibility and customer engagement within a compact retail space. The layout organizes footwear displays, apparel racks, central merchandise islands, a checkout counter, and a comfortable seating area along a clear circulation path, creating an energetic and efficient shopping experience.",
    styleMaterials:
      "Contemporary sporty style with a black, white, and charcoal palette accented by vivid brand colors, turquoise display niches, pink LED strips, graphic wall panels, illuminated shelving, white marble-effect flooring, matte black fixtures, colorful suspended ceiling elements, mannequins, and focused track lighting.",
  },
  "36": {
    orderLabel: "36",
    name: "Contemporary Luxury Apartment",
    projectType: "Residential Interior Design",
    location: "Birzeit, Palestine",
    year: "2024",
    area: "115 m²",
    concept:
      "A contemporary luxury apartment designed as a cohesive and comfortable family residence. The interior connects the living room, dining area, kitchen, and service spaces through a consistent material palette and carefully planned circulation. Integrated storage, generous natural light, and refined architectural details create a sense of openness, elegance, and everyday comfort.",
    styleMaterials:
      "Contemporary luxury style with warm beige and gray tones, natural wood cabinetry and wall panels, black marble-effect surfaces, light wood-look flooring, soft upholstered furniture, sheer curtains, dark metal accents, glass shower partitions, built-in shelving, indoor greenery, and layered recessed and linear LED lighting.",
  },
};
