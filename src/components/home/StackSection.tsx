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

import { theme } from "@/site";

import type {
  GalleryTeaserContent,
  MenuTeaserContent,
  StorySectionContent,
} from "@/types/homepage";

import {
  Container,
} from "@/components/ui/Container";

import {
  PremiumHoverLink,
} from "@/components/ui/PremiumHoverLink";

gsap.registerPlugin(
  ScrollTrigger
);

type StackContent =
  | StorySectionContent
  | MenuTeaserContent
  | GalleryTeaserContent;

type Props = {
  section: StackContent;
};

export function StackSection({
  section,
}: Props) {
  const rootRef =
    useRef<HTMLElement>(null);

  const mediaRef =
    useRef<HTMLDivElement>(null);

  const zoomRef =
    useRef<HTMLDivElement>(null);

  useIsomorphicLayoutEffect(() => {
    const root =
      rootRef.current;

    if (!root) {
      return;
    }

    if (
      window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches
    ) {
      return;
    }

    const card =
      root.closest<HTMLElement>(
        "[data-stack-card]"
      );

    const stackRoot =
      card?.parentElement;

    /*
     * Sticky elements report their pinned viewport position.
     * offsetTop remains tied to document layout, so these
     * ranges also refresh correctly while the page is mid-stack.
     */
    const layoutTop = () => {
      if (card && stackRoot) {
        return (
          stackRoot.getBoundingClientRect()
            .top +
          window.scrollY +
          card.offsetTop
        );
      }

      return (
        root.getBoundingClientRect()
          .top + window.scrollY
      );
    };

    const parallaxStart = () =>
      layoutTop() -
      window.innerHeight;

    const parallaxEnd = () =>
      layoutTop() +
      root.offsetHeight;

    const context =
      gsap.context(() => {
        if (
          theme.motion.imageParallax
        ) {
          gsap.fromTo(
            mediaRef.current,
            {
              yPercent: -4,
              scale: 1.09,
            },
            {
              yPercent: 4,
              scale: 1.05,
              ease: "none",
              force3D: true,

              scrollTrigger: {
                start: parallaxStart,
                end: parallaxEnd,
                scrub: true,
                invalidateOnRefresh:
                  true,
              },
            }
          );

        }

        const revealItems =
          gsap.utils.toArray<HTMLElement>(
            "[data-reveal]",
            root
          );

        gsap.fromTo(
          revealItems,
          {
            y: 56,
            opacity: 0,
            clipPath:
              "inset(100% 0 0 0)",
          },
          {
            y: 0,
            opacity: 1,
            clipPath:
              "inset(0% 0 0 0)",
            duration: 1.25,
            stagger: 0.11,
            clearProps: "clipPath",
            ease: "power4.out",

            scrollTrigger: {
              start: () =>
                layoutTop() -
                window.innerHeight *
                  0.78,
              toggleActions:
                "play none none none",
              once: true,
              invalidateOnRefresh:
                true,
            },
          }
        );
      }, root);

    return () =>
      context.revert();
  }, []);

  function zoomIn() {
    gsap.to(
      zoomRef.current,
      {
        scale: 1.035,
        duration: 1.1,
        ease: "power3.out",
        overwrite: "auto",
        force3D: true,
      }
    );
  }

  function zoomOut() {
    gsap.to(
      zoomRef.current,
      {
        scale: 1,
        duration: 1,
        ease: "power3.inOut",
        overwrite: "auto",
        force3D: true,
      }
    );
  }

  const image = (
    <div
      ref={mediaRef}
      className="absolute -inset-[6%] will-change-transform"
    >
      <div
        ref={zoomRef}
        className="absolute inset-0 will-change-transform"
      >
        <Image
          src={section.image.src}
          alt={section.image.alt}
          fill
          sizes="100vw"
          className="object-cover"
          style={{
            objectPosition:
              `${
                section.image
                  .focalPoint?.x ??
                50
              }% ${
                section.image
                  .focalPoint?.y ??
                50
              }%`,
          }}
        />
      </div>
    </div>
  );

  if (
    section.type ===
    "menu-teaser"
  ) {
    return (
      <section
        id={section.id}
        ref={rootRef}
        data-home-scene
        data-scene-type={section.type}
        className="relative min-h-svh overflow-hidden bg-[#24050b] text-foreground"
      >
        <div className="grid min-h-full lg:grid-cols-[minmax(0,1.16fr)_minmax(380px,0.84fr)]">
          <figure className="relative min-h-[48svh] overflow-hidden border-b border-white/15 lg:min-h-full lg:border-b-0 lg:border-r">
            {image}

            <div
              aria-hidden="true"
              className="absolute inset-0 bg-black/18"
            />

            <figcaption className="absolute bottom-5 left-5 border border-white/25 bg-black/35 px-4 py-3 font-body text-[9px] uppercase tracking-[0.22em] text-white/70 backdrop-blur-sm md:bottom-8 md:left-8">
              Seasonal · Fire-led
            </figcaption>
          </figure>

          <div className="relative flex min-h-[52svh] items-center px-5 py-20 sm:px-10 lg:min-h-full lg:px-[clamp(3rem,6vw,7rem)] lg:py-32">
            <div
              className="max-w-[610px]"
            >
              <p data-reveal className="border-t border-white/20 pt-5 font-body text-[10px] uppercase tracking-[0.28em] text-primary">
                {section.eyebrow}
              </p>

              <h2 data-reveal className="mt-8 font-display text-[clamp(3.8rem,6vw,7.4rem)] font-normal leading-[0.84] tracking-[-0.06em]">
                {section.title}
              </h2>

              {section.body && (
                <p data-reveal className="mt-8 max-w-[440px] font-body text-sm leading-7 text-foreground/70 md:text-base">
                  {section.body}
                </p>
              )}

              <div data-reveal className="mt-11">
                <PremiumHoverLink
                  href={section.action.href}
                  onHoverStart={zoomIn}
                  onHoverEnd={zoomOut}
                >
                  {section.action.label}
                </PremiumHoverLink>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (
    section.type ===
    "gallery-teaser"
  ) {
    return (
      <section
        id={section.id}
        ref={rootRef}
        data-home-scene
        data-scene-type={section.type}
        className="relative min-h-svh overflow-hidden bg-[#d7cec1] text-[#17110f]"
      >
        <div className="flex min-h-full flex-col lg:block">
          <div className="relative z-10 flex min-h-[48svh] items-center px-5 pb-10 pt-28 sm:px-10 lg:min-h-full lg:w-[48%] lg:px-[clamp(3rem,7vw,8rem)] lg:py-32">
            <div
              className="max-w-[650px]"
            >
              <p data-reveal className="border-t border-black/25 pt-5 font-body text-[10px] uppercase tracking-[0.28em] text-primary">
                {section.eyebrow}
              </p>

              <h2 data-reveal className="mt-7 font-display text-[clamp(3.7rem,6.2vw,7.8rem)] font-normal leading-[0.84] tracking-[-0.06em]">
                {section.title}
              </h2>

              {section.body && (
                <p data-reveal className="mt-7 max-w-[430px] font-body text-sm leading-7 text-black/65 md:text-base">
                  {section.body}
                </p>
              )}

              <div data-reveal className="mt-9 text-[#17110f]">
                <PremiumHoverLink
                  href={section.action.href}
                  onHoverStart={zoomIn}
                  onHoverEnd={zoomOut}
                >
                  {section.action.label}
                </PremiumHoverLink>
              </div>
            </div>
          </div>

          <figure className="relative min-h-[52svh] flex-1 overflow-hidden border-t border-black/15 lg:absolute lg:bottom-0 lg:right-0 lg:top-0 lg:min-h-0 lg:w-[56%] lg:border-l lg:border-t-0">
            {image}

            <div
              aria-hidden="true"
              className="absolute inset-0 bg-black/10"
            />

            <figcaption className="absolute bottom-5 right-5 bg-[#d7cec1] px-4 py-3 font-body text-[9px] uppercase tracking-[0.22em] text-black/60 md:bottom-8 md:right-8">
              The dining room
            </figcaption>
          </figure>
        </div>
      </section>
    );
  }

  return (
    <section
      id={section.id}
      ref={rootRef}
      data-home-scene
      data-scene-type={section.type}
      className="relative min-h-svh overflow-hidden bg-black text-white"
    >
      {image}

      <div
        aria-hidden="true"
        className="absolute inset-0 bg-black/30"
      />

      <div
        aria-hidden="true"
        className="absolute inset-0 bg-primary/25 mix-blend-multiply"
      />

      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-r from-black/[0.04] via-black/20 to-black/85"
      />

      <Container className="relative z-20 grid min-h-full grid-cols-12 items-center pb-16 pt-32">
        <div
          className="col-span-11 col-start-2 max-w-[780px] md:col-span-6 md:col-start-7"
        >
          <p data-reveal className="border-t border-white/25 pt-5 font-body text-[10px] uppercase tracking-[0.28em] text-primary">
            {section.eyebrow}
          </p>

          <h2 data-reveal className="mt-8 font-display text-[clamp(4rem,7vw,8.4rem)] font-normal leading-[0.82] tracking-[-0.06em] drop-shadow-[0_4px_30px_rgba(0,0,0,0.42)]">
            {section.title}
          </h2>

          <p data-reveal className="mt-8 max-w-[470px] font-body text-sm leading-7 text-white/72 md:text-base">
            {section.body}
          </p>
        </div>
      </Container>
    </section>
  );
}
