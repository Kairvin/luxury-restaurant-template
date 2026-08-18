"use client";

import {
  useLayoutEffect,
  useRef,
} from "react";

import gsap from "gsap";

import {
  ScrollTrigger,
} from "gsap/ScrollTrigger";

gsap.registerPlugin(
  ScrollTrigger
);

type RollingPanelProps = {
  children: React.ReactNode;

  id?: string;
};

export function RollingPanel({
  children,
  id,
}: RollingPanelProps) {
  const rootRef =
    useRef<HTMLElement>(null);

  const visualRef =
    useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const root =
      rootRef.current;

    const visual =
      visualRef.current;

    if (
      !root ||
      !visual
    ) {
      return;
    }

    const reducedMotion =
      window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

    if (
      reducedMotion
    ) {
      return;
    }

    const ctx =
      gsap.context(() => {

        /*
         * ===============================================================
         * THE CORE MATHEMATICS
         * ===============================================================
         *
         * Incoming transition:
         *
         * root travels:
         *     60vh
         *
         * visual additionally travels:
         *     12vh
         *
         * 12 / 60 = 0.2
         *
         * Therefore:
         *
         * normal speed     = 1.0
         * additional speed = 0.2
         *
         * TOTAL            = 1.2x
         *
         * Exactly what we want.
         */

        gsap.fromTo(
          visual,

          {
            y: 0,
          },

          {
            y: () =>
              -window.innerHeight *
              0.12,

            ease:
              "none",

            scrollTrigger: {
              trigger:
                root,

              /*
               * Panel begins touching
               * bottom of viewport.
               */
              start:
                "top bottom",

              /*
               * Panel root moves:
               *
               * bottom → 40%
               *
               * = 60% viewport travel.
               */
              end:
                "top 40%",

              /*
               * Direct scroll mapping.
               *
               * Lenis is already doing the
               * smoothing for us.
               */
              scrub:
                true,

              invalidateOnRefresh:
                true,

              /*
               * Incoming section temporarily
               * sits above the outgoing one.
               */
              onEnter: () => {
                root.style.zIndex =
                  "2";
              },

              onEnterBack: () => {
                root.style.zIndex =
                  "2";
              },

              /*
               * Once entrance is complete,
               * return it to the base layer.
               *
               * Since it appears later in the DOM,
               * it still naturally paints over
               * older z1 sections where required.
               */
              onLeave: () => {
                root.style.zIndex =
                  "1";
              },

              onLeaveBack: () => {
                root.style.zIndex =
                  "1";
              },
            },
          }
        );

      }, root);


    /*
     * Recalculate after layout/fonts/images.
     */
    requestAnimationFrame(
      () => {
        ScrollTrigger.refresh();
      }
    );


    return () => {
      ctx.revert();
    };

  }, []);


  return (
    <section
      id={id}

      ref={rootRef}

      data-rolling-panel

      /*
       * Root remains completely normal.
       *
       * It travels upward with the user's
       * page scroll at 1x.
       */
      className={[
        "relative",

        "h-svh",

        "overflow-visible",
      ].join(" ")}

      style={{
        zIndex: 1,
      }}
    >

      {/*
       * ================================================================
       * MOVING PANEL
       * ================================================================
       *
       * Panel is 112vh tall because by the end
       * of entry it sits -12vh above its root.
       *
       * Therefore:
       *
       * top    = root - 12vh
       * bottom = root + 100vh
       *
       * No gap can appear.
       */}

      <div
        ref={visualRef}

        data-rolling-visual

        className={[
          "absolute",

          "left-0",
          "top-0",

          "h-[112svh]",

          "w-full",

          "overflow-hidden",

          "bg-background",

          /*
           * Opaque panel with subtle physical depth.
           *
           * NO MASK.
           * NO BLENDING.
           */
          "shadow-[0_-20px_55px_rgba(0,0,0,0.28)]",

          "will-change-transform",
        ].join(" ")}
      >

        {children}


        {/*
         * Small leading-edge shadow.
         *
         * This is inside the incoming panel,
         * so it creates depth without mixing
         * the two photographs.
         */}

        <div
          aria-hidden="true"

          className={[
            "pointer-events-none",

            "absolute",

            "left-0",
            "right-0",
            "top-0",

            "z-[80]",

            "h-8",

            "bg-gradient-to-b",

            "from-black/25",

            "to-transparent",
          ].join(" ")}
        />

      </div>

    </section>
  );
}
