import type { Metadata } from "next";

import { restaurant } from "@/site";

export const metadata: Metadata = {
  title: `Menu | ${restaurant.identity.name}`,
  description: "Explore our interactive menu book: turn the pages, browse the courses, and discover our special dishes.",
};

export default function MenuPage() {
  return (
    <main className="h-dvh w-full overflow-hidden bg-[#f5efe6]">
      {/* The supplied menu owns its scrolling, navigation, and 3D page-turn scene. */}
      <iframe
        src="/menu-book/index.html"
        title={`${restaurant.identity.name} interactive restaurant menu`}
        className="block h-full w-full border-0"
      />
    </main>
  );
}
