/**
 * Central image encode settings — Next.js serves AVIF/WebP from these qualities.
 * Sources can stay WebP/JPEG; the optimizer picks the best wire format per browser.
 */

/** Project cards, galleries, service panels — sharp at display size. */
export const SITE_IMAGE_QUALITY = 90;

/** Thumbnails, mega-nav previews, tiny avatars. */
export const SITE_THUMB_QUALITY = 84;
