import { z } from "zod";

/* -------------------------------------------------------------------------- */
/*                                   Media                                    */
/* -------------------------------------------------------------------------- */

const focalPointSchema = z.object({
  x: z.number().min(0).max(100),
  y: z.number().min(0).max(100),
});

const mediaCreditSchema = z.object({
  name: z.string().min(1),
  url: z.string().url().optional(),
});

export const mediaAssetSchema = z.object({
  src: z.string().min(1),

  alt: z.string().min(1),

  width: z.number().int().positive(),
  height: z.number().int().positive(),

  focalPoint: focalPointSchema.optional(),

  priority: z.boolean().optional(),

  credit: mediaCreditSchema.optional(),
});

/* -------------------------------------------------------------------------- */
/*                                Restaurant                                  */
/* -------------------------------------------------------------------------- */

const timeSchema = z
  .string()
  .regex(
    /^([01]\d|2[0-3]):[0-5]\d$/,
    "Time must use 24-hour HH:MM format"
  );

const openingPeriodSchema = z.object({
  opens: timeSchema,
  closes: timeSchema,
});

const dayScheduleSchema = z.object({
  closed: z.boolean().optional(),

  periods: z
    .array(openingPeriodSchema)
    .optional(),
});

const openingHoursSchema = z.object({
  monday: dayScheduleSchema,
  tuesday: dayScheduleSchema,
  wednesday: dayScheduleSchema,
  thursday: dayScheduleSchema,
  friday: dayScheduleSchema,
  saturday: dayScheduleSchema,
  sunday: dayScheduleSchema,
});

const socialLinksSchema = z.object({
  instagram: z.string().url().optional(),
  facebook: z.string().url().optional(),
  tiktok: z.string().url().optional(),
  youtube: z.string().url().optional(),
});

export const restaurantSchema = z.object({
  identity: z.object({
    name: z.string().min(1),

    shortName: z.string().min(1).optional(),

    legalName: z.string().min(1).optional(),

    tagline: z.string().min(1).optional(),

    established: z
      .number()
      .int()
      .min(1800)
      .max(2200)
      .optional(),

    cuisine: z
      .array(z.string().min(1))
      .min(1),

    priceRange: z
      .enum(["$", "$$", "$$$", "$$$$"])
      .optional(),
  }),

  locale: z.object({
    language: z.string().min(2),

    locale: z.string().min(2),

    currency: z
      .string()
      .length(3)
      .transform((value) =>
        value.toUpperCase()
      ),

    timeZone: z.string().min(1),
  }),

  contact: z.object({
    email: z.string().email().optional(),

    phone: z.string().min(6).optional(),

    whatsapp: z.string().min(6).optional(),
  }),

  location: z.object({
    addressLine1: z.string().min(1),

    addressLine2: z
      .string()
      .min(1)
      .optional(),

    city: z.string().min(1),

    region: z.string().min(1).optional(),

    postalCode: z
      .string()
      .min(1)
      .optional(),

    country: z.string().min(2),

    coordinates: z
      .object({
        latitude: z
          .number()
          .min(-90)
          .max(90),

        longitude: z
          .number()
          .min(-180)
          .max(180),
      })
      .optional(),
  }),

  openingHours: openingHoursSchema,

  socials: socialLinksSchema,
});

/* -------------------------------------------------------------------------- */
/*                                   Theme                                    */
/* -------------------------------------------------------------------------- */

export const themeSchema = z.object({
  colors: z.object({
    background: z.string().min(1),

    surface: z.string().min(1),

    surfaceElevated: z.string().min(1),

    primary: z.string().min(1),

    primaryHover: z.string().min(1),

    text: z.string().min(1),

    textMuted: z.string().min(1),

    border: z.string().min(1),

    reservationBackground:
      z.string().min(1),

    reservationText:
      z.string().min(1),
  }),

  typography: z.object({
    preset: z.enum([
      "editorial",
      "modern",
      "heritage",
    ]),
  }),

  motion: z.object({
    intensity: z.enum([
      "minimal",
      "balanced",
      "cinematic",
    ]),

    smoothScroll: z.boolean(),

    imageParallax: z.boolean(),

    stickyStacking: z.boolean(),
  }),
});

/* -------------------------------------------------------------------------- */
/*                                Features                                    */
/* -------------------------------------------------------------------------- */

export const featuresSchema = z.object({
  menu: z.boolean(),

  pageTurnMenu: z.boolean(),

  gallery: z.boolean(),

  galleryLightbox: z.boolean(),

  reservations: z.boolean(),

  chefSection: z.boolean(),

  privateDining: z.boolean(),

  events: z.boolean(),

  newsletter: z.boolean(),

  smoothScroll: z.boolean(),

  analytics: z.boolean(),
});

/* -------------------------------------------------------------------------- */
/*                               Reservation                                  */
/* -------------------------------------------------------------------------- */

export const reservationSchema =
  z.discriminatedUnion("mode", [
    z.object({
      mode: z.literal("internal"),

      route: z.literal("/reservation"),
    }),

    z.object({
      mode: z.literal("external"),

      provider: z.enum([
        "opentable",
        "resy",
        "sevenrooms",
        "thefork",
        "quandoo",
        "other",
      ]),

      url: z.string().url(),
    }),

    z.object({
      mode: z.literal("phone"),

      phone: z.string().min(6),
    }),

    z.object({
      mode: z.literal("whatsapp"),

      phone: z.string().min(6),

      message: z.string().optional(),
    }),
  ]);

/* -------------------------------------------------------------------------- */
/*                                Homepage                                    */
/* -------------------------------------------------------------------------- */

const ctaSchema = z.object({
  label: z.string().min(1),

  href: z.string().min(1),

  ariaLabel: z
    .string()
    .min(1)
    .optional(),
});

const heroSchema = z.object({
  eyebrow: z.string().optional(),

  title: z.string().min(1),

  description: z.string().optional(),

  leftImage: mediaAssetSchema,

  rightImage: mediaAssetSchema,

  footerNote: z.string().optional(),
});

const storySectionSchema = z.object({
  type: z.literal("story"),

  id: z.string().min(1),

  eyebrow: z.string().optional(),

  title: z.string().min(1),

  body: z.string().min(1),

  alignment: z.enum([
    "left",
    "right",
  ]),

  image: mediaAssetSchema,
});

const menuTeaserSchema = z.object({
  type: z.literal("menu-teaser"),

  id: z.string().min(1),

  eyebrow: z.string().optional(),

  title: z.string().min(1),

  body: z.string().optional(),

  alignment: z.enum([
    "left",
    "right",
  ]),

  image: mediaAssetSchema,

  action: ctaSchema,
});

const galleryTeaserSchema = z.object({
  type: z.literal("gallery-teaser"),

  id: z.string().min(1),

  eyebrow: z.string().optional(),

  title: z.string().min(1),

  body: z.string().optional(),

  alignment: z.enum([
    "left",
    "right",
  ]),

  image: mediaAssetSchema,

  action: ctaSchema,
});

const closingSectionSchema = z.object({
  type: z.literal("closing"),

  id: z.string().min(1),

  title: z.string().min(1),

  scriptAccent: z.string().optional(),

  image: mediaAssetSchema.optional(),

  action: ctaSchema.optional(),
});

const homepageSectionSchema =
  z.discriminatedUnion("type", [
    storySectionSchema,
    menuTeaserSchema,
    galleryTeaserSchema,
    closingSectionSchema,
  ]);

export const homepageSchema = z.object({
  hero: heroSchema,

  sections: z
    .array(homepageSectionSchema)
    .min(1),
});

/* -------------------------------------------------------------------------- */
/*                                   Menu                                     */
/* -------------------------------------------------------------------------- */

const moneyPriceSchema = z.object({
  type: z.literal("money"),

  amount: z.number().nonnegative(),

  currency: z
    .string()
    .length(3)
    .optional(),
});

const labelPriceSchema = z.object({
  type: z.literal("label"),

  label: z.string().min(1),
});

const menuPriceSchema =
  z.discriminatedUnion("type", [
    moneyPriceSchema,
    labelPriceSchema,
  ]);

const dietaryTagSchema = z.enum([
  "vegetarian",
  "vegan",
  "gluten-free",
  "dairy-free",
  "contains-nuts",
  "spicy",
]);

const menuVariantSchema = z.object({
  label: z.string().min(1),

  price: menuPriceSchema,
});

const menuItemSchema = z
  .object({
    name: z.string().min(1),

    description: z
      .string()
      .optional(),

    price: menuPriceSchema.optional(),

    variants: z
      .array(menuVariantSchema)
      .optional(),

    dietary: z
      .array(dietaryTagSchema)
      .optional(),

    featured: z.boolean().optional(),
  })
  .refine(
    (item) =>
      item.price !== undefined ||
      item.variants !== undefined,
    {
      message:
        "Menu item must have a price or variants",
    }
  );

const menuCategorySchema = z.object({
  id: z.string().min(1),

  title: z.string().min(1),

  description: z
    .string()
    .optional(),

  items: z
    .array(menuItemSchema)
    .min(1),
});

const restaurantMenuSchema = z.object({
  id: z.string().min(1),

  title: z.string().min(1),

  subtitle: z.string().optional(),

  categories: z
    .array(menuCategorySchema)
    .min(1),
});

export const menuSchema = z.object({
  menus: z
    .array(restaurantMenuSchema)
    .min(1),
});

/* -------------------------------------------------------------------------- */
/*                                  Gallery                                   */
/* -------------------------------------------------------------------------- */

const galleryCategorySchema = z.enum([
  "food",
  "interior",
  "drinks",
  "people",
  "details",
  "exterior",
]);

const galleryItemSchema = z.object({
  id: z.string().min(1),

  category: galleryCategorySchema,

  image: mediaAssetSchema,
});

export const gallerySchema = z.object({
  title: z.string().min(1),

  introduction: z
    .string()
    .optional(),

  items: z
    .array(galleryItemSchema)
    .min(1),
});

/* -------------------------------------------------------------------------- */
/*                                    SEO                                     */
/* -------------------------------------------------------------------------- */

const pageSeoSchema = z.object({
  title: z.string().min(1),

  description: z
    .string()
    .min(1),

  image: z.string().optional(),

  noIndex: z.boolean().optional(),
});

export const seoSchema = z.object({
  home: pageSeoSchema,

  menu: pageSeoSchema,

  gallery: pageSeoSchema,

  reservation: pageSeoSchema,
});

/* -------------------------------------------------------------------------- */
/*                               Complete Site                                */
/* -------------------------------------------------------------------------- */

export const siteSchema = z.object({
  restaurant: restaurantSchema,

  theme: themeSchema,

  features: featuresSchema,

  reservation: reservationSchema,

  homepage: homepageSchema,

  menu: menuSchema,

  gallery: gallerySchema,

  seo: seoSchema,
});