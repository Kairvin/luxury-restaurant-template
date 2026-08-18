import type { GalleryContent } from "@/types/gallery";

export const gallery = {
  title: "The Restaurant",

  introduction:
    "An intimate study of food, light and space.",

  items: [
    {
      id: "interior-01",

      category: "interior",

      image: {
        src:
          "/restaurant/gallery/interior-01.webp",

        alt:
          "Candlelit restaurant dining room",

        width: 1600,
        height: 2200,
      },
    },

    {
      id: "dish-01",

      category: "food",

      image: {
        src:
          "/restaurant/gallery/dish-01.webp",

        alt:
          "Seasonal plated restaurant dish",

        width: 2200,
        height: 1600,
      },
    },
  ],
} satisfies GalleryContent;