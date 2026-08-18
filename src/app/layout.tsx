import type {
  Metadata,
  Viewport,
} from "next";

import "./globals.css";

import {
  SiteShell,
} from "@/components/layout/SiteShell";


import {
  restaurant,
  seo,
  theme,
} from "@/site";

import {
  getFontPreset,
} from "@/lib/fonts/registry";

import {
  createThemeStyle,
} from "@/lib/theme/createThemeStyle";

const fontPreset =
  getFontPreset(
    theme.typography.preset
  );

export const metadata: Metadata = {
  title: {
    default:
      seo.home.title,

    template:
      `%s | ${restaurant.identity.name}`,
  },

  description:
    seo.home.description,
};

export const viewport: Viewport = {
  width: "device-width",

  initialScale: 1,

  themeColor:
    theme.colors.background,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang={
        restaurant.locale.language
      }
      className={
        fontPreset.className
      }
      style={
        createThemeStyle(theme)
      }
      data-theme={
        theme.typography.preset
      }
      data-motion={
        theme.motion.intensity
      }
    >
      <body>
        <SiteShell>
          {children}
        </SiteShell>
      </body>
    </html>
  );
}
