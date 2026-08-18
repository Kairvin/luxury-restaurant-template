export type TypographyPreset =
  | "editorial"
  | "modern"
  | "heritage";

export type MotionIntensity =
  | "minimal"
  | "balanced"
  | "cinematic";

export type ThemeConfig = {
  colors: {
    background: string;

    surface: string;
    surfaceElevated: string;

    primary: string;
    primaryHover: string;

    text: string;
    textMuted: string;

    border: string;

    reservationBackground: string;
    reservationText: string;
  };

  typography: {
    preset: TypographyPreset;
  };

  motion: {
    intensity: MotionIntensity;

    smoothScroll: boolean;
    imageParallax: boolean;
    stickyStacking: boolean;
  };
};