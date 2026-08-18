import {
  homepage,
  restaurant,
} from "@/site";

import {
  HeroSection,
} from "@/components/home/HeroSection";

import {
  StackSection,
} from "@/components/home/StackSection";

import {
  ClosingSection,
} from "@/components/home/ClosingSection";

import {
  StackedSections,
} from "@/components/motion/StackedSections";

export default function HomePage() {
  return (
    <main className="relative bg-background">
      <StackedSections>
        <HeroSection
          content={
            homepage.hero
          }
          restaurantName={
            restaurant.identity.name
          }
        />

        {homepage.sections.map(
          (section) =>
            section.type ===
            "closing" ? (
              <ClosingSection
                key={
                  section.id
                }
                content={
                  section
                }
              />
            ) : (
              <StackSection
                key={
                  section.id
                }
                section={
                  section
                }
              />
            )
        )}
      </StackedSections>
    </main>
  );
}
