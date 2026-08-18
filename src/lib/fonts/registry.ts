import {
  Allura,
  Cormorant_Garamond,
  DM_Serif_Display,
  Fleur_De_Leah,
  Gelasio,
  Inter,
  Manrope,
} from "next/font/google";

import type { TypographyPreset } from "@/types/theme";

/* -------------------------------------------------------------------------- */
/*                               Editorial                                    */
/* -------------------------------------------------------------------------- */

const editorialDisplay = Gelasio({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--site-font-display",
  display: "swap",
});

const editorialBody = Inter({
  subsets: ["latin"],
  variable: "--site-font-body",
  display: "swap",
});

const editorialAccent = Fleur_De_Leah({
  subsets: ["latin"],
  weight: "400",
  variable: "--site-font-accent",
  display: "swap",
});

/* -------------------------------------------------------------------------- */
/*                                 Modern                                     */
/* -------------------------------------------------------------------------- */

const modernDisplay = DM_Serif_Display({
  subsets: ["latin"],
  weight: "400",
  variable: "--site-font-display",
  display: "swap",
});

const modernBody = Manrope({
  subsets: ["latin"],
  variable: "--site-font-body",
  display: "swap",
});

const modernAccent = Allura({
  subsets: ["latin"],
  weight: "400",
  variable: "--site-font-accent",
  display: "swap",
});

/* -------------------------------------------------------------------------- */
/*                                Heritage                                    */
/* -------------------------------------------------------------------------- */

const heritageDisplay = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--site-font-display",
  display: "swap",
});

/*
 * We deliberately reuse Inter + Fleur De Leah here.
 * Later we can add more curated combinations without changing components.
 */
const heritageBody = editorialBody;
const heritageAccent = editorialAccent;

/* -------------------------------------------------------------------------- */
/*                              Preset Contract                               */
/* -------------------------------------------------------------------------- */

type FontPresetConfig = {
  className: string;

  labels: {
    display: string;
    body: string;
    accent: string;
  };
};

export const fontPresets: Record<
  TypographyPreset,
  FontPresetConfig
> = {
  editorial: {
    className: [
      editorialDisplay.variable,
      editorialBody.variable,
      editorialAccent.variable,
    ].join(" "),

    labels: {
      display: "Gelasio",
      body: "Inter",
      accent: "Fleur De Leah",
    },
  },

  modern: {
    className: [
      modernDisplay.variable,
      modernBody.variable,
      modernAccent.variable,
    ].join(" "),

    labels: {
      display: "DM Serif Display",
      body: "Manrope",
      accent: "Allura",
    },
  },

  heritage: {
    className: [
      heritageDisplay.variable,
      heritageBody.variable,
      heritageAccent.variable,
    ].join(" "),

    labels: {
      display: "Cormorant Garamond",
      body: "Inter",
      accent: "Fleur De Leah",
    },
  },
};

export function getFontPreset(
  preset: TypographyPreset
): FontPresetConfig {
  return fontPresets[preset];
}
