import {
  useEffect,
  useLayoutEffect,
} from "react";

/**
 * Client Components are still pre-rendered on the server,
 * where `useLayoutEffect` logs a warning and never runs.
 *
 * In the browser we keep the pre-paint timing GSAP needs so
 * the first painted frame already has the stack transforms
 * applied — no flash of un-stacked sections.
 */
export const useIsomorphicLayoutEffect =
  typeof window !== "undefined"
    ? useLayoutEffect
    : useEffect;
