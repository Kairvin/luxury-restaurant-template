import type { FeatureConfig } from "@/types/features";

export const features = {
  menu: true,

  pageTurnMenu: true,

  gallery: true,

  galleryLightbox: true,

  reservations: true,

  chefSection: false,

  privateDining: false,

  events: false,

  newsletter: false,

  smoothScroll: true,

  analytics: false,
} satisfies FeatureConfig;