export type DayKey =
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday"
  | "sunday";

export type OpeningPeriod = {
  opens: string;
  closes: string;
};

export type DaySchedule = {
  closed?: boolean;
  periods?: OpeningPeriod[];
};

export type SocialLinks = {
  instagram?: string;
  facebook?: string;
  tiktok?: string;
  youtube?: string;
};

export type RestaurantConfig = {
  identity: {
    name: string;
    shortName?: string;
    legalName?: string;

    tagline?: string;
    established?: number;

    cuisine: string[];

    priceRange?: "$" | "$$" | "$$$" | "$$$$";
  };

  locale: {
    language: string;
    locale: string;
    currency: string;
    timeZone: string;
  };

  contact: {
    email?: string;
    phone?: string;
    whatsapp?: string;
  };

  location: {
    addressLine1: string;
    addressLine2?: string;

    city: string;
    region?: string;
    postalCode?: string;

    country: string;

    coordinates?: {
      latitude: number;
      longitude: number;
    };
  };

  openingHours: Record<DayKey, DaySchedule>;

  socials: SocialLinks;
};