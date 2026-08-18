"use client";

import {
  Children,
  isValidElement,
  useRef,
  type ReactNode,
} from "react";

import gsap from "gsap";

import {
  ScrollTrigger,
} from "gsap/ScrollTrigger";

import { theme } from "@/site";

import {
  useIsomorphicLayoutEffect,
} from "@/lib/motion/useIsomorphicLayoutEffect";

import {
  getStackTuning,
  isStaticTuning,
  type StackTuning,
} from "@/lib/motion/stackTuning";

import {
  REDUCED_MOTION_QUERY,
} from "@/lib/motion/reducedMotion";

gsap.registerPlugin(
  ScrollTrigger
);

const MOBILE_QUERY =
  "(max-width: 767px)";

const DESKTOP_QUERY =
  "(min-width: 768px)";

type StackedSectionsProps = {
  children: ReactNode;
};

/**
 * Scroll-stacked full-height sections.
 *
 * Every section is a `position: sticky` card pinned to the top
 * of the viewport with a z-index one higher than the card
 * before it. Scrolling therefore slides each new card up over
 * the one already pinned, like dealing cards onto a pile.
 *
 * While a card is being covered it remains pinned in place,
 * scaling down and dimming subtly so the incoming curtain reads
 * as depth rather than as two identical planes.
 *
 * ## Why the triggers use numeric scroll positions
 *
 * `start: "top bottom"` resolves against `getBoundingClientRect()`,
 * which for a sticky element reports its *pinned* position, not
 * its position in the document flow. Measuring a sticky trigger
 * is therefore only correct while it happens to be unpinned —
 * which is exactly not the case on a refresh mid-page.
 *
 * Instead the handoff range is computed from layout metrics that
 * sticky never touches (`offsetHeight`, plus the static root's
 * own document offset) and handed to ScrollTrigger as absolute
 * pixel positions.
 */
export function StackedSections({
  children,
}: StackedSectionsProps) {
  const rootRef =
    useRef<HTMLDivElement>(null);

  const sections =
    Children.toArray(children);

  const lastIndex =
    sections.length - 1;

  useIsomorphicLayoutEffect(() => {
    const root = rootRef.current;

    if (
      !root ||
      !theme.motion.stickyStacking
    ) {
      return;
    }

    const media =
      gsap.matchMedia();

    const build = (
      tuning: StackTuning
    ) => {
      const cards =
        gsap.utils.toArray<HTMLElement>(
          "[data-stack-card]",
          root
        );

      if (cards.length < 2) {
        return;
      }

      /*
       * Document-space top of each card's layout box.
       *
       * Rebuilt on every refresh so orientation changes and
       * font swaps stay accurate.
       */
      const cardTops: number[] = [];

      const measure = () => {
        const rootTop =
          root.getBoundingClientRect()
            .top +
          window.scrollY;

        let offset = 0;

        cards.forEach(
          (card, index) => {
            cardTops[index] =
              rootTop + offset;

            offset +=
              card.offsetHeight;
          }
        );
      };

      measure();

      ScrollTrigger.addEventListener(
        "refreshInit",
        measure
      );

      cards.forEach(
        (card, index) => {
          gsap.set(card, {
            transformOrigin:
              "50% 0%",

            force3D: true,
          });

          const incoming =
            index + 1;

          /* The last card is never covered. */
          if (
            incoming >=
            cards.length
          ) {
            return;
          }

          const veil =
            card.querySelector<HTMLElement>(
              "[data-stack-veil]"
            );

          const layers = veil
            ? [card, veil]
            : [card];

          const timeline =
            gsap.timeline({
              defaults: {
                ease: "none",
                force3D: true,
              },

              scrollTrigger: {
                /*
                 * From "the incoming card's top edge touches
                 * the bottom of the viewport" to "it has
                 * reached the top" — the exact span during
                 * which the new card covers this one.
                 */
                start: () =>
                  cardTops[
                    incoming
                  ] -
                  window.innerHeight,

                end: () =>
                  cardTops[
                    incoming
                  ],

                /*
                 * Immediate scrub: Lenis already supplies the
                 * smoothing, so adding ScrollTrigger's own
                 * would read as lag.
                 */
                scrub: true,

                invalidateOnRefresh:
                  true,

                /*
                 * Compositor hints only while the handoff is
                 * live. Left on permanently, every card holds
                 * its own GPU layer for the whole session.
                 */
                onToggle: (self) => {
                  gsap.set(layers, {
                    willChange:
                      self.isActive
                        ? "transform, opacity"
                        : "auto",
                  });
                },
              },
            });

          timeline.fromTo(
            card,

            {
              scale: 1,
            },

            {
              scale: tuning.scale,
            },

            0
          );

          if (veil) {
            timeline.fromTo(
              veil,

              {
                opacity: 0,
              },

              {
                opacity:
                  1 -
                  tuning.brightness,
              },

              0
            );
          }
        }
      );

      return () => {
        ScrollTrigger.removeEventListener(
          "refreshInit",
          measure
        );
      };
    };

    media.add(
      {
        isMobile: MOBILE_QUERY,
        isDesktop: DESKTOP_QUERY,
        isReduced:
          REDUCED_MOTION_QUERY,
      },

      (context) => {
        const conditions =
          context.conditions;

        /*
         * Reduced motion keeps the sections as a plain
         * document flow — see the CSS fallback below.
         */
        if (
          conditions?.isReduced ===
          true
        ) {
          return;
        }

        const tuning =
          getStackTuning(
            theme.motion.intensity,

            conditions?.isMobile ===
            true
              ? "mobile"
              : "desktop"
          );

        if (
          isStaticTuning(tuning)
        ) {
          return;
        }

        return build(tuning);
      }
    );

    const refreshFrame =
      window.requestAnimationFrame(
        () => {
          ScrollTrigger.refresh();
        }
      );

    return () => {
      window.cancelAnimationFrame(
        refreshFrame
      );

      media.revert();
    };
  }, [sections.length]);

  return (
    <div
      ref={rootRef}
      data-stack-root
      className="relative isolate bg-background"
    >
      {sections.map(
        (section, index) => {
          const sectionKey =
            isValidElement(section) &&
            section.key !== null
              ? section.key
              : `stack-card-${index}`;

          const isFirst =
            index === 0;

          const isLast =
            index === lastIndex;

          return (
            <div
              key={sectionKey}
              data-stack-card
              data-stack-index={index}
              className={[
                /*
                 * `grid` lets the section inside stretch to
                 * the full card height while still being
                 * allowed to grow taller than it.
                 */
                "grid",

                "sticky top-0",

                /*
                 * `dvh` over `svh`: the card must always fill
                 * the *current* viewport. A card measured
                 * against the small viewport leaves a strip of
                 * the next card visible under it the moment a
                 * mobile URL bar collapses.
                 */
                "min-h-dvh",

                "overflow-hidden",

                /*
                 * The first card has nothing above it to curve
                 * away from, so it stays flush.
                 */
                isFirst
                  ? ""
                  : "rounded-t-2xl shadow-2xl md:rounded-t-3xl",

                /* Reduced motion keeps the sticky curtain but skips transforms. */
                "motion-reduce:transform-none",
              ]
                .filter(Boolean)
                .join(" ")}
              style={{
                zIndex: index + 1,
              }}
            >
              {section}

              {/*
                * Dimming veil.
                *
                * Darkening the card with an overlay instead of
                * fading its opacity keeps the photography
                * opaque — a translucent card would let the
                * page background show through its own image.
                */}
              {!isLast && (
                <div
                  aria-hidden="true"
                  data-stack-veil
                  className="pointer-events-none absolute inset-0 z-50 bg-black opacity-0"
                />
              )}
            </div>
          );
        }
      )}
    </div>
  );
}
