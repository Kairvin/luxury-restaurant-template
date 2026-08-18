"use client";

import Image from "next/image";

import {
  useRef,
} from "react";

import gsap from "gsap";

import {
  ScrollTrigger,
} from "gsap/ScrollTrigger";

import {
  useIsomorphicLayoutEffect,
} from "@/lib/motion/useIsomorphicLayoutEffect";

gsap.registerPlugin(
  ScrollTrigger
);

import type {
  HeroContent,
} from "@/types/homepage";

import {
  Container,
} from "@/components/ui/Container";

type HeroSectionProps = {
  content: HeroContent;

  restaurantName: string;
};

export function HeroSection({
  content,
  restaurantName,
}: HeroSectionProps) {
  const rootRef =
    useRef<HTMLElement>(null);

  const leftImageRef =
    useRef<HTMLElement>(null);

  const rightImageRef =
    useRef<HTMLElement>(null);

  const eyebrowRef =
    useRef<HTMLParagraphElement>(null);

  const titleRef =
    useRef<HTMLHeadingElement>(null);

  const descriptionRef =
    useRef<HTMLParagraphElement>(null);

  const footerRef =
    useRef<HTMLDivElement>(null);

  useIsomorphicLayoutEffect(() => {
    if (
      window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches
    ) {
      return;
    }

    const context =
      gsap.context(() => {
        const timeline =
          gsap.timeline({
            defaults: {
              ease: "power4.out",
            },
          });

        timeline
          .fromTo(
            leftImageRef.current,

            {
              xPercent: -70,
              opacity: 0,
              scale: 1.08,
              clipPath:
                "inset(0 100% 0 0)",
            },

            {
              xPercent: 0,
              opacity: 1,
              scale: 1,
              clipPath:
                "inset(0 0% 0 0)",
              duration: 1.55,
            }
          )

          .fromTo(
            rightImageRef.current,

            {
              xPercent: 70,
              opacity: 0,
              scale: 1.08,
              clipPath:
                "inset(0 0 0 100%)",
            },

            {
              xPercent: 0,
              opacity: 1,
              scale: 1,
              clipPath:
                "inset(0 0 0 0%)",
              duration: 1.55,
            },

            "-=1.22"
          )

          .fromTo(
            eyebrowRef.current,

            {
              y: 20,
              opacity: 0,
            },

            {
              y: 0,
              opacity: 1,
              duration: 0.8,
            },

            "-=0.9"
          )

          .fromTo(
            titleRef.current,

            {
              y: 80,
              opacity: 0,
            },

            {
              y: 0,
              opacity: 1,
              duration: 1.15,
            },

            "-=0.7"
          )

          .fromTo(
            descriptionRef.current,

            {
              y: 30,
              opacity: 0,
            },

            {
              y: 0,
              opacity: 1,
              duration: 0.85,
            },

            "-=0.65"
          )

          .fromTo(
            footerRef.current,

            {
              opacity: 0,
            },

            {
              opacity: 1,
              duration: 0.9,
            },

            "-=0.35"
          );
      }, rootRef);

    return () =>
      context.revert();
  }, []);

  return (
    <section
      ref={rootRef}
      className={[
        "relative z-10",
        "min-h-svh overflow-hidden",
        "bg-background text-foreground",
      ].join(" ")}
    >
      {/* ambient background */}

      <div
        aria-hidden="true"
        className={[
          "absolute inset-0",
          "bg-[radial-gradient(circle_at_55%_45%,rgba(140,0,20,0.13),transparent_38%)]",
        ].join(" ")}
      />

      {/* LEFT IMAGE */}

      <figure
        ref={leftImageRef}
        className={[
          "absolute",
          "left-[4.5vw]",
          "top-[27vh]",
          "h-[50vh]",
          "w-[29vw]",
          "overflow-hidden",
          "max-lg:left-[-10vw]",
          "max-lg:top-[35vh]",
          "max-lg:h-[43vh]",
          "max-lg:w-[55vw]",
          "max-sm:left-[-13vw]",
          "max-sm:top-[44vh]",
          "max-sm:h-[38vh]",
          "max-sm:w-[67vw]",
        ].join(" ")}
      >
        <Image
          src={
            content.leftImage.src
          }
          alt={
            content.leftImage.alt
          }
          fill
          priority
          sizes="(max-width: 768px) 70vw, 30vw"
          className="object-cover"
          style={{
            objectPosition:
              `${
                content.leftImage
                  .focalPoint?.x ??
                50
              }% ${
                content.leftImage
                  .focalPoint?.y ??
                50
              }%`,
          }}
        />

        <div
          aria-hidden="true"
          className="absolute inset-0 bg-black/12"
        />

        <figcaption
          className={[
            "absolute bottom-0 left-0",
            "bg-black/80 px-4 py-3",
            "font-body text-[9px]",
            "uppercase tracking-[0.18em]",
            "text-white/75",
          ].join(" ")}
        >
          Seasonal produce
        </figcaption>
      </figure>

      {/* RIGHT IMAGE */}

      <figure
        ref={rightImageRef}
        className={[
          "absolute",
          "right-[3.5vw]",
          "top-[19vh]",
          "h-[59vh]",
          "w-[27vw]",
          "overflow-hidden",
          "max-lg:right-[-9vw]",
          "max-lg:top-[22vh]",
          "max-lg:h-[47vh]",
          "max-lg:w-[47vw]",
          "max-sm:right-[-20vw]",
          "max-sm:top-[21vh]",
          "max-sm:h-[39vh]",
          "max-sm:w-[61vw]",
        ].join(" ")}
      >
        <Image
          src={
            content.rightImage.src
          }
          alt={
            content.rightImage.alt
          }
          fill
          priority
          sizes="(max-width: 768px) 65vw, 28vw"
          className="object-cover"
          style={{
            objectPosition:
              `${
                content.rightImage
                  .focalPoint?.x ??
                50
              }% ${
                content.rightImage
                  .focalPoint?.y ??
                50
              }%`,
          }}
        />

        <div
          aria-hidden="true"
          className="absolute inset-0 bg-black/15"
        />

        <figcaption
          className={[
            "absolute bottom-0 right-0",
            "bg-black/80 px-4 py-3",
            "font-body text-[9px]",
            "uppercase tracking-[0.18em]",
            "text-white/75",
          ].join(" ")}
        >
          The dining room
        </figcaption>
      </figure>

      <Container
        className={[
          "relative z-20",
          /*
           * Fills the stack card rather than the small
           * viewport, so the footer row stays welded to the
           * card's bottom edge when a mobile URL bar collapses.
           */
          "flex min-h-full",
          "flex-col",
          "pb-8 pt-32",
          "lg:pb-10 lg:pt-36",
        ].join(" ")}
      >
        <div
          className={[
            "relative",
            "grid flex-1",
            "grid-cols-12",
          ].join(" ")}
        >
          <div
            className={[
              "col-span-10",
              "col-start-3",
              "self-start",
              "pt-[3vh]",
              "max-lg:col-span-11",
              "max-lg:col-start-2",
              "max-sm:col-span-12",
              "max-sm:col-start-1",
            ].join(" ")}
          >
            <p
              ref={eyebrowRef}
              className={[
                "mb-6",
                "font-body text-[10px]",
                "uppercase",
                "tracking-[0.28em]",
                "text-primary",
                "md:ml-[11vw]",
              ].join(" ")}
            >
              {
                content.eyebrow
              }
            </p>

            <h1
              ref={titleRef}
              className={[
                "relative",
                "max-w-[1000px]",
                "font-display",
                "text-[clamp(4rem,7.7vw,9rem)]",
                "font-normal",
                "leading-[0.82]",
                "tracking-[-0.065em]",
                "text-foreground",
                "drop-shadow-[0_4px_30px_rgba(0,0,0,0.7)]",
              ].join(" ")}
            >
              {content.title}
            </h1>

            {content.description && (
              <p
                ref={
                  descriptionRef
                }
                className={[
                  "mt-7",
                  "max-w-[420px]",
                  "font-body",
                  "text-sm",
                  "leading-6",
                  "text-foreground/78",
                  "md:ml-[28vw]",
                  "md:mt-8",
                  "md:text-base",
                  "md:leading-7",
                ].join(" ")}
              >
                {
                  content.description
                }
              </p>
            )}
          </div>
        </div>

        <div
          ref={footerRef}
          className={[
            "relative z-30",
            "flex items-end",
            "justify-between",
            "border-t border-white/15",
            "pt-4",
          ].join(" ")}
        >
          <p
            className={[
              "font-body",
              "text-[9px]",
              "uppercase",
              "tracking-[0.22em]",
              "text-white/55",
            ].join(" ")}
          >
            {
              content.footerNote
            }
          </p>

          <div className="text-right">
            <p
              className={[
                "font-body",
                "text-[9px]",
                "uppercase",
                "tracking-[0.2em]",
                "text-white/40",
              ].join(" ")}
            >
              {restaurantName}
            </p>

            <p
              className={[
                "mt-1",
                "font-accent",
                "text-3xl",
                "text-primary",
                "md:text-5xl",
              ].join(" ")}
            >
              Fire. Season. Restraint.
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
