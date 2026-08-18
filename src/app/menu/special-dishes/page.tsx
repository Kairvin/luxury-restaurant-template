import type {
  Metadata,
} from "next";

import {
  SpecialDishReveal,
} from "@/components/special-dishes/SpecialDishReveal";

export const metadata: Metadata = {
  title: "Special Dishes",
  description:
    "A cinematic scroll-driven reveal of the restaurant's special dish.",
};

export default function SpecialDishesPage() {
  return (
    <SpecialDishReveal />
  );
}
