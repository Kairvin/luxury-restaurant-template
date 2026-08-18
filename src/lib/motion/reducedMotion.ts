export const REDUCED_MOTION_QUERY =
  "(prefers-reduced-motion: reduce)";

/**
 * Reads the current motion preference.
 *
 * Safe to call during server rendering: it reports
 * "motion is fine" and the client corrects it on mount.
 */
export function prefersReducedMotion(): boolean {
  if (
    typeof window === "undefined" ||
    typeof window.matchMedia !== "function"
  ) {
    return false;
  }

  return window.matchMedia(
    REDUCED_MOTION_QUERY
  ).matches;
}

/**
 * Subscribes to changes in the motion preference so a
 * running experience can tear its animations down the
 * moment the user asks for less motion.
 *
 * Returns an unsubscribe function.
 */
export function onReducedMotionChange(
  handler: (reduced: boolean) => void
): () => void {
  if (
    typeof window === "undefined" ||
    typeof window.matchMedia !== "function"
  ) {
    return () => {};
  }

  const query =
    window.matchMedia(
      REDUCED_MOTION_QUERY
    );

  const listener = (
    event: MediaQueryListEvent
  ) => {
    handler(event.matches);
  };

  query.addEventListener(
    "change",
    listener
  );

  return () => {
    query.removeEventListener(
      "change",
      listener
    );
  };
}
