export interface ServiceGalleryVideo {
  id: string;
  orderLabel: string;
  title: string;
  client: string;
  description: string;
  src: string;
  featured?: boolean;
}

export interface ServiceGalleryCopy {
  eyebrow: string;
  title: string;
  titleAccent: string;
  description: string;
  badge: string;
  ctaHref: string;
  ctaLabel: string;
  headingId: string;
}
