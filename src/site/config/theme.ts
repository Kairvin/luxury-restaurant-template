import type { ThemeConfig } from "@/types/theme";

export const theme = {
  colors: {
    background: "#080808",

    surface: "#0D0D0D",

    surfaceElevated: "#151515",

    primary: "#8C0014",

    primaryHover: "#A6001C",

    text: "#F3EFE8",

    textMuted: "#B9B3AA",

    border: "rgba(243, 239, 232, 0.20)",

    reservationBackground: "#FFFFFF",

    reservationText: "#090909",
  },

  typography: {
    preset: "editorial",
  },

  motion: {
    intensity: "cinematic",

    smoothScroll: true,

    imageParallax: true,

    stickyStacking: true,
  },
} satisfies ThemeConfig;