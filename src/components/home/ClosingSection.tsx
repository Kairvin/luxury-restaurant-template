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
  ClosingSectionContent,
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

export function ClosingSection({
  content,
}: {
  content:
    ClosingSectionContent;
}) {
  const rootRef =
    useRef<HTMLElement>(null);

  const imageRef =
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
            imageRef.current,
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
            stagger: 0.12,
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

  return (
    <section
      id="contact"
      ref={rootRef}
      data-home-scene
      data-scene-type={content.type}
      className="relative min-h-[115svh] overflow-hidden bg-background text-white lg:min-h-svh"
    >
      {content.image && (
        <figure className="absolute left-0 top-0 h-[45svh] w-full overflow-hidden border-b border-white/15 lg:bottom-0 lg:h-auto lg:w-[56%] lg:border-b-0 lg:border-r">
          <div
            ref={imageRef}
            className="absolute -inset-[6%] will-change-transform"
          >
            <Image
              src={content.image.src}
              alt={content.image.alt}
              fill
              sizes="(max-width: 1024px) 100vw, 56vw"
              className="object-cover"
              style={{
                objectPosition:
                  `${
                    content.image
                      .focalPoint?.x ??
                    50
                  }% ${
                    content.image
                      .focalPoint?.y ??
                    50
                  }%`,
              }}
            />
          </div>

          <div
            aria-hidden="true"
            className="absolute inset-0 bg-black/30"
          />

          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-b from-transparent to-background/70 lg:bg-gradient-to-l lg:from-background/45 lg:to-transparent"
          />

        </figure>
      )}

      <Container className="relative flex min-h-[115svh] flex-col justify-between pb-9 pt-[52svh] lg:min-h-full lg:pb-10 lg:pt-32">
        <div className="flex flex-1 items-center lg:justify-end">
          <div
            className="max-w-[760px] lg:w-[44%] lg:pl-[clamp(2.5rem,5vw,6rem)]"
          >
            {content.scriptAccent && (
              <p data-reveal className="font-accent text-6xl leading-none text-primary md:text-8xl">
                {content.scriptAccent}
              </p>
            )}

            <h2 data-reveal className="mt-7 font-display text-[clamp(4rem,7vw,8.5rem)] leading-[0.82] tracking-[-0.06em]">
              {content.title}
            </h2>

            {content.action && (
              <div data-reveal className="mt-10">
                <PremiumHoverLink
                  href={content.action.href}
                >
                  {content.action.label}
                </PremiumHoverLink>
              </div>
            )}
          </div>
        </div>

        <footer className="grid gap-4 border-t border-white/15 pt-5 font-body text-[9px] uppercase tracking-[0.18em] text-white/45 md:grid-cols-3">
          <span>
            ROUGE
          </span>

          <span className="md:text-center">
            New York · United States
          </span>

          <span className="md:text-right">
            © 2026
          </span>
        </footer>
      </Container>
    </section>
  );
}
