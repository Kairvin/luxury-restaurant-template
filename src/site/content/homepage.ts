import type { HomepageContent } from "@/types/homepage";

export const homepage = {
  hero: {
    eyebrow: "THE RESTAURANT",

    title:
      "Dining shaped by fire, season and restraint.",

    description:
      "An intimate dining experience where produce, flame and simplicity define the evening.",

    leftImage: {
      src:
        "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1800&q=88",

      alt:
        "Fine dining table and plated cuisine",

      width: 1800,
      height: 2200,

      focalPoint: {
        x: 50,
        y: 50,
      },

      priority: true,
    },

    rightImage: {
      src:
        "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1800&q=88",

      alt:
        "Atmospheric luxury restaurant dining room",

      width: 1800,
      height: 2200,

      focalPoint: {
        x: 50,
        y: 50,
      },

      priority: true,
    },

    footerNote: "EST. 2026",
  },

  sections: [
    {
      type: "story",

      id: "philosophy",

      eyebrow: "OUR PHILOSOPHY",

      title:
        "Fire. Produce. Precision.",

      body:
        "We cook with restraint. Exceptional produce, elemental fire and thoughtful technique shape every plate while the ingredient remains at the centre of the experience.",

      alignment: "right",

      image: {
        src:
          "https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=2400&q=88",

        alt:
          "Warmly lit restaurant interior",

        width: 2400,
        height: 1600,

        focalPoint: {
          x: 42,
          y: 50,
        },
      },
    },

    {
      type: "menu-teaser",

      id: "menu",

      eyebrow: "THE MENU",

      title:
        "Ingredients dictate the evening.",

      body:
        "Our menu moves with the season. Produce arrives at its peak and leaves when its moment has passed.",

      alignment: "left",

      image: {
        src:
          "https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?auto=format&fit=crop&w=2400&q=88",

        alt:
          "Beautifully presented seasonal restaurant food",

        width: 2400,
        height: 1600,

        focalPoint: {
          x: 60,
          y: 48,
        },
      },

      action: {
        label: "Explore Menu",
        href: "/menu",
      },
    },

    {
      type: "gallery-teaser",

      id: "space",

      eyebrow: "THE SPACE",

      title:
        "Designed for long evenings.",

      body:
        "Low light, tactile materials and considered details create a room made for conversation, celebration and lingering well beyond dinner.",

      alignment: "right",

      image: {
        src:
          "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=2400&q=88",

        alt:
          "Elegant restaurant interior and dining tables",

        width: 2400,
        height: 1600,

        focalPoint: {
          x: 38,
          y: 48,
        },
      },

      action: {
        label: "Explore Gallery",
        href: "/gallery",
      },
    },

    {
      type: "closing",

      id: "closing",

      title:
        "An evening worth remembering.",

      scriptAccent:
        "Stay awhile",

      image: {
        src:
          "https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=2400&q=88",

        alt:
          "Intimate restaurant interior at night",

        width: 2400,
        height: 1600,

        focalPoint: {
          x: 50,
          y: 50,
        },
      },

      action: {
        label: "Reserve a Table",
        href: "/reservation",
      },
    },
  ],
} satisfies HomepageContent;
