import type { NavigationConfig } from "@/types/navigation";

export const navigation = {
  items: [
    {
      label: "About",
      href: "/#philosophy",
    },
    {
      label: "Menu",
      href: "/menu",
    },
    {
      label: "Gallery",
      href: "/gallery",
    },
    {
      label: "Contact",
      href: "/#contact",
    },
  ],
} satisfies NavigationConfig;
