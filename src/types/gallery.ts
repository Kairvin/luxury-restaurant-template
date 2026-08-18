import type { MediaAsset } from "./media";

export type GalleryCategory =
  | "food"
  | "interior"
  | "drinks"
  | "people"
  | "details"
  | "exterior";

export type GalleryItem = {
  id: string;

  category: GalleryCategory;

  image: MediaAsset;
};

export type GalleryContent = {
  title: string;

  introduction?: string;

  items: GalleryItem[];
};