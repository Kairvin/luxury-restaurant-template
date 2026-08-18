import type { MediaAsset } from "./media";

export type ContentAlignment = "left" | "right";

export type CTA = {
  label: string;
  href: string;
  ariaLabel?: string;
};

export type HeroContent = {
  eyebrow?: string;

  title: string;
  description?: string;

  leftImage: MediaAsset;
  rightImage: MediaAsset;

  footerNote?: string;
};

export type StorySectionContent = {
  type: "story";

  id: string;

  eyebrow?: string;

  title: string;
  body: string;

  alignment: ContentAlignment;

  image: MediaAsset;
};

export type MenuTeaserContent = {
  type: "menu-teaser";

  id: string;

  eyebrow?: string;

  title: string;
  body?: string;

  alignment: ContentAlignment;

  image: MediaAsset;

  action: CTA;
};

export type GalleryTeaserContent = {
  type: "gallery-teaser";

  id: string;

  eyebrow?: string;

  title: string;
  body?: string;

  alignment: ContentAlignment;

  image: MediaAsset;

  action: CTA;
};

export type ClosingSectionContent = {
  type: "closing";

  id: string;

  title: string;

  scriptAccent?: string;

  image?: MediaAsset;

  action?: CTA;
};

export type HomepageSection =
  | StorySectionContent
  | MenuTeaserContent
  | GalleryTeaserContent
  | ClosingSectionContent;

export type HomepageContent = {
  hero: HeroContent;

  sections: HomepageSection[];
};