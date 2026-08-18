import type { CSSProperties } from "react";
import type { ThemeConfig } from "@/types/theme";

type ThemeCSSProperties = CSSProperties & {
  "--site-background": string;
  "--site-surface": string;
  "--site-surface-elevated": string;

  "--site-primary": string;
  "--site-primary-hover": string;

  "--site-text": string;
  "--site-text-muted": string;

  "--site-border": string;

  "--site-reservation-background": string;
  "--site-reservation-text": string;
};

export function createThemeStyle(
  theme: ThemeConfig
): ThemeCSSProperties {
  return {
    "--site-background":
      theme.colors.background,

    "--site-surface":
      theme.colors.surface,

    "--site-surface-elevated":
      theme.colors.surfaceElevated,

    "--site-primary":
      theme.colors.primary,

    "--site-primary-hover":
      theme.colors.primaryHover,

    "--site-text":
      theme.colors.text,

    "--site-text-muted":
      theme.colors.textMuted,

    "--site-border":
      theme.colors.border,

    "--site-reservation-background":
      theme.colors.reservationBackground,

    "--site-reservation-text":
      theme.colors.reservationText,
  };
}
