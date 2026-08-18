import type {
  Metadata,
} from "next";

import {
  InfiniteCanvasGallery,
} from "@/components/gallery/InfiniteCanvasGallery";

export const metadata: Metadata = {
  title: "Gallery",
  description:
    "Explore the restaurant through an interactive archive of food, service, drinks, and atmosphere.",
};

export default function GalleryPage() {
  return (
    <InfiniteCanvasGallery />
  );
}
