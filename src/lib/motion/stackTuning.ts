import type {
  MotionIntensity,
} from "@/types/theme";

export type StackViewport =
  | "desktop"
  | "mobile";

export type StackTuning = {
  /**
   * Scale the outgoing card settles at once the
   * incoming card has fully covered it.
   */
  scale: number;

  /**
   * Perceived brightness of the outgoing card.
   *
   * `0.6` means the card reads at 60% brightness. It is
   * applied with a black veil rather than by fading the
   * card itself, so the receding card never turns
   * translucent and never lets the page background
   * bleed through its photography.
  */
  brightness: number;
};

/**
 * Motion budget per `theme.motion.intensity`.
 *
 * Mobile is deliberately tamer: a full 0.92 scale on a
 * phone exposes a wide band of background around the
 * receding card and reads as a layout bug rather than
 * as depth.
 */
const STACK_TUNING: Record<
  MotionIntensity,
  Record<StackViewport, StackTuning>
> = {
  minimal: {
    desktop: {
      scale: 1,
      brightness: 1,
    },

    mobile: {
      scale: 1,
      brightness: 1,
    },
  },

  balanced: {
    desktop: {
      scale: 0.96,
      brightness: 0.78,
    },

    mobile: {
      scale: 0.98,
      brightness: 0.86,
    },
  },

  cinematic: {
    desktop: {
      scale: 0.92,
      brightness: 0.6,
    },

    mobile: {
      scale: 0.965,
      brightness: 0.72,
    },
  },
};

export function getStackTuning(
  intensity: MotionIntensity,
  viewport: StackViewport
): StackTuning {
  return STACK_TUNING[intensity][
    viewport
  ];
}

/**
 * True when the intensity produces no visible handoff, in
 * which case the sticky stack is rendered without any
 * scroll-driven work at all.
 */
export function isStaticTuning(
  tuning: StackTuning
): boolean {
  return (
    tuning.scale === 1 &&
    tuning.brightness === 1
  );
}
