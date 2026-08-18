"use client";

import {
  Children,
  type ReactNode,
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

type Props = {
  children: ReactNode;

  ids: string[];
};

const FRONT_SPEED =
  1.2;

export function CurtainSequence({
  children,
  ids,
}: Props) {
  const trackRef =
    useRef<HTMLDivElement>(null);

  const panelRefs =
    useRef<
      Array<HTMLDivElement | null>
    >([]);

  const panels =
    Children.toArray(
      children
    );


  useLayoutEffect(() => {
    const track =
      trackRef.current;

    const elements =
      panelRefs.current.filter(
        (
          panel
        ): panel is HTMLDivElement =>
          panel !== null
      );

    if (
      !track ||
      elements.length < 2
    ) {
      return;
    }


    const reducedMotion =
      window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

    if (reducedMotion) {
      return;
    }


    const context =
      gsap.context(() => {

        elements.forEach(
          (
            panel,
            index
          ) => {

            const z =
              index % 2 === 0
                ? 1
                : 2;

            const speed =
              index % 2 === 0
                ? 1
                : FRONT_SPEED;

            panel.dataset.speed =
              String(
                speed
              );

            panel.dataset.layer =
              String(
                z
              );


            gsap.set(
              panel,
              {
                yPercent:
                  index === 0
                    ? 0
                    : 100,

                zIndex:
                  z,

                force3D:
                  true,

                visibility:
                  "visible",
              }
            );

            panel.inert =
              index !== 0;

            panel.setAttribute(
              "aria-hidden",
              String(
                index !== 0
              )
            );

          }
        );


        /*
         * Hide copy initially for all panels
         * except the opening hero.
         */

        elements.forEach(
          (
            panel,
            index
          ) => {

            if (
              index === 0
            ) {
              return;
            }

            const content =
              panel.querySelector(
                "[data-curtain-content]"
              );

            if (
              content
            ) {
              gsap.set(
                content,
                {
                  y:
                    38,

                  opacity:
                    0,
                }
              );
            }

          }
        );


        const timeline =
          gsap.timeline({
            defaults: {
              ease:
                "none",
            },

            scrollTrigger: {
              trigger:
                track,

              start:
                "top top",

              end:
                "bottom bottom",

              scrub:
                true,

              invalidateOnRefresh:
                true,

              onUpdate: (self) => {
                const activeIndex =
                  Math.min(
                    elements.length - 1,
                    Math.round(
                      self.progress *
                        (
                          elements.length -
                          1
                        )
                    )
                  );

                elements.forEach(
                  (
                    panel,
                    panelIndex
                  ) => {
                    const isActive =
                      panelIndex ===
                      activeIndex;

                    panel.inert =
                      !isActive;

                    panel.setAttribute(
                      "aria-hidden",
                      String(
                        !isActive
                      )
                    );
                  }
                );
              },
            },
          });


        /*
         * ===============================================================
         * TRANSITIONS
         * ===============================================================
         */

        for (
          let index = 0;
          index <
          elements.length - 1;
          index++
        ) {

          const outgoing =
            elements[
              index
            ];

          const incoming =
            elements[
              index + 1
            ];


          const incomingIndex =
            index + 1;


          const incomingSpeed =
            incomingIndex %
              2 ===
            0
              ? 1
              : FRONT_SPEED;


          timeline.to(
            outgoing,
            {
              yPercent:
                -100,

              duration:
                1,

              ease:
                "none",

              force3D:
                true,
            },

            index
          );


          const incomingDuration =
            1 /
            incomingSpeed;


          timeline.to(
            incoming,
            {
              yPercent:
                0,

              duration:
                incomingDuration,

              ease:
                "none",

              force3D:
                true,
            },

            index
          );


          /*
           * -------------------------------------------------------------
           * COPY REVEAL
           * -------------------------------------------------------------
           */

          const content =
            incoming.querySelector(
              "[data-curtain-content]"
            );

          if (
            content
          ) {

            timeline.to(
              content,
              {
                y:
                  0,

                opacity:
                  1,

                duration:
                  0.32,

                ease:
                  "power3.out",
              },

              index +
                0.18
            );

          }

        }


        requestAnimationFrame(
          () => {
            ScrollTrigger.refresh();
          }
        );

      }, track);


    return () => {
      context.revert();
    };

  }, []);


  const trackHeight =
    `${panels.length * 100}svh`;


  return (
    <div
      ref={
        trackRef
      }

      data-curtain-master

      className={[
        "relative",

        "w-full",
      ].join(" ")}

      style={{
        height:
          trackHeight,
      }}
    >

      {ids.map(
        (
          id,
          index
        ) => (

          <span
            key={
              id
            }

            id={
              id
            }

            aria-hidden="true"

            className={[
              "pointer-events-none",

              "absolute",

              "left-0",

              "h-px",

              "w-px",
            ].join(" ")}

            style={{
              top:
                `${index * 100}svh`,
            }}
          />

        )
      )}


      <div
        data-curtain-stage

        className={[
          "sticky",

          "top-0",

          "h-svh",

          "w-full",

          "overflow-hidden",

          "bg-background",
        ].join(" ")}
      >

        {panels.map(
          (
            child,
            index
          ) => {

            const z =
              index % 2 === 0
                ? 1
                : 2;

            const speed =
              index % 2 === 0
                ? "1.0×"
                : "1.2×";


            return (
              <div
                key={
                  index
                }

                ref={
                  (
                    element
                  ) => {
                    panelRefs.current[
                      index
                    ] =
                      element;
                  }
                }

                data-curtain-panel

                data-panel-index={
                  index
                }

                data-panel-speed={
                  speed
                }

                data-panel-layer={
                  z === 2
                    ? "front"
                    : "back"
                }

                className={[
                  "absolute",

                  "inset-0",

                  "h-svh",

                  "w-full",

                  "overflow-hidden",

                  "bg-background",

                  "will-change-transform",
                ].join(" ")}

                style={{
                  zIndex:
                    z,

                  visibility:
                    "visible",

                  transform:
                    index === 0
                      ? "translate3d(0, 0, 0)"
                      : "translate3d(0, 100%, 0)",
                }}
              >

                {child}

              </div>
            );

          }
        )}

      </div>

    </div>
  );
}
