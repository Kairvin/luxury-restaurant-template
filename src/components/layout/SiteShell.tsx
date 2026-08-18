import type {
  ReactNode,
} from "react";

import {
  Navbar,
} from "./Navbar";

import {
  ReservationCTA,
} from "./ReservationCTA";

import {
  SmoothScrollProvider,
} from "@/components/motion/SmoothScrollProvider";

export function SiteShell({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <SmoothScrollProvider>
      <Navbar />

      {children}

      <ReservationCTA />
    </SmoothScrollProvider>
  );
}
