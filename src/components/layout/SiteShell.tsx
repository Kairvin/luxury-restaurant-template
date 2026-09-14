"use client";

import { usePathname } from "next/navigation";

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
  const pathname = usePathname();

  // The menu book supplies its own navigation and scroll container. Keep the
  // standard shell on nested routes such as /menu/special-dishes.
  if (pathname === "/menu") {
    return <>{children}</>;
  }

  return (
    <SmoothScrollProvider>
      <Navbar />

      {children}

      <ReservationCTA />
    </SmoothScrollProvider>
  );
}
