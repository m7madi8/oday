/**
 * Google Maps directions for the Ramallah office — replace the destination when your pin is final.
 * @example "https://www.google.com/maps/dir/?api=1&destination=31.9230623%2C35.2090546&travelmode=driving"
 */
export const OFFICE_DIRECTIONS_URL =
  "https://www.google.com/maps/dir/?api=1&destination=31.9230623%2C35.2090546&travelmode=driving";

export const studioLocation = {
  eyebrow: "Office Location",
  heading: "Where We Build",
  headingAccent: "From Ramallah",
  addressLine2: "Ramallah, Palestine",
  coordinates: { lat: 31.9230623, lng: 35.2090546 },
  /** Google Maps embed (no API key) — used in the office visit card. */
  mapEmbedUrl:
    "https://maps.google.com/maps?q=31.9230623,35.2090546&z=16&hl=en&output=embed",
  directionsUrl: OFFICE_DIRECTIONS_URL,
  openInMapsUrl:
    "https://www.google.com/maps/place/Dental+Spa+Clinic+%D8%A7%D9%84%D8%AF%D9%83%D8%AA%D9%88%D8%B1+%D9%85%D8%AD%D9%81%D9%88%D8%B8+%D9%81%D9%88%D8%A7%D9%84%D8%AD%D8%A9,+Al-Bireh,+Ramallah/@31.9230623,35.2090546,17z",
};
