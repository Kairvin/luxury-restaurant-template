import type { RestaurantConfig } from "@/types/restaurant";

export const restaurant = {
  identity: {
    name: "ROUGE",

    shortName: "ROUGE",

    tagline: "Fire. Season. Restraint.",

    established: 2026,

    cuisine: [
      "Contemporary",
      "Open Fire",
    ],

    priceRange: "$$$",
  },

  locale: {
    language: "en",
    locale: "en-US",
    currency: "USD",
    timeZone: "America/New_York",
  },

  contact: {
    email: "reservations@example.com",
    phone: "+1 000 000 0000",
  },

  location: {
    addressLine1: "120 Example Street",

    city: "New York",
    region: "NY",

    postalCode: "10001",

    country: "US",
  },

  openingHours: {
    monday: {
      closed: true,
    },

    tuesday: {
      periods: [
        {
          opens: "17:00",
          closes: "23:00",
        },
      ],
    },

    wednesday: {
      periods: [
        {
          opens: "17:00",
          closes: "23:00",
        },
      ],
    },

    thursday: {
      periods: [
        {
          opens: "17:00",
          closes: "23:00",
        },
      ],
    },

    friday: {
      periods: [
        {
          opens: "17:00",
          closes: "00:00",
        },
      ],
    },

    saturday: {
      periods: [
        {
          opens: "17:00",
          closes: "00:00",
        },
      ],
    },

    sunday: {
      periods: [
        {
          opens: "17:00",
          closes: "22:00",
        },
      ],
    },
  },

  socials: {
    instagram: "https://instagram.com/example",
  },
} satisfies RestaurantConfig;