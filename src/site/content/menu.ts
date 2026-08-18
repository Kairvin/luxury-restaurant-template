import type { MenuContent } from "@/types/menu";

export const menu = {
  menus: [
    {
      id: "dinner",

      title: "Dinner",

      subtitle: "Seasonal Menu",

      categories: [
        {
          id: "first",

          title: "First",

          items: [
            {
              name: "Oyster",

              description:
                "Citrus · Jalapeño · Sea Herbs",

              price: {
                type: "money",
                amount: 18,
              },
            },

            {
              name: "Tuna",

              description:
                "Avocado · Sesame · Ponzu",

              price: {
                type: "money",
                amount: 24,
              },
            },

            {
              name: "Beef Tartare",

              description:
                "Mustard · Caper · Brioche",

              price: {
                type: "money",
                amount: 26,
              },
            },
          ],
        },

        {
          id: "fire",

          title: "From the Fire",

          items: [
            {
              name: "Sea Bass",

              description:
                "Charred Lemon · Herbs",

              price: {
                type: "money",
                amount: 42,
              },
            },

            {
              name: "Short Rib",

              description:
                "Smoked Onion · Black Garlic",

              price: {
                type: "money",
                amount: 54,
              },
            },
          ],
        },
      ],
    },
  ],
} satisfies MenuContent;