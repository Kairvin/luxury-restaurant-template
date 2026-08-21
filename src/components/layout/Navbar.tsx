"use client";

import Link from "next/link";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  navigation,
  restaurant,
} from "@/site";

import {
  Container,
} from "@/components/ui/Container";

import {
  AnimatedTextLink,
} from "@/components/ui/AnimatedTextLink";

import {
  MobileMenu,
} from "./MobileMenu";

import styles from "./Navbar.module.css";

export function Navbar() {
  const [
    scrolled,
    setScrolled,
  ] = useState(false);

  const frameRef =
    useRef<HTMLDivElement>(null);

  const topFadeRef =
    useRef<HTMLDivElement>(null);

  const displacementRef =
    useRef<SVGFEDisplacementMapElement | null>(
      null
    );

  useEffect(() => {
    const frame = frameRef.current;
    const topFade = topFadeRef.current;

    if (!frame || !topFade) {
      return;
    }

    let animationFrame = 0;

    const renderMaterial = () => {
      animationFrame = 0;

      const rawProgress = Math.max(
        0,
        Math.min(1, window.scrollY / 150)
      );

      /* Smoothstep makes the material ease in and settle naturally. */
      const progress =
        rawProgress *
        rawProgress *
        (3 - 2 * rawProgress);

      frame.style.setProperty(
        "--glass-progress",
        progress.toFixed(4)
      );

      frame.style.setProperty(
        "--glass-blur",
        `${(2 * progress).toFixed(2)}px`
      );

      frame.style.setProperty(
        "--glass-saturation",
        `${(10 * progress).toFixed(2)}%`
      );

      frame.style.setProperty(
        "--glass-scale-x",
        (1.035 - 0.035 * progress).toFixed(4)
      );

      frame.style.setProperty(
        "--glass-scale-y",
        (0.94 + 0.06 * progress).toFixed(4)
      );

      frame.style.setProperty(
        "--glass-sheen-x",
        `${(-18 + 34 * progress).toFixed(2)}%`
      );

      frame.style.setProperty(
        "--glass-rim-opacity",
        "0"
      );

      frame.style.setProperty(
        "--glass-sheen-opacity",
        (0.12 + 0.88 * progress).toFixed(4)
      );

      topFade.style.opacity =
        (1 - 0.92 * progress).toFixed(4);

      displacementRef.current?.setAttribute(
        "scale",
        (14 * progress).toFixed(2)
      );

      setScrolled((current) => {
        const next =
          window.scrollY > 40;

        return current === next
          ? current
          : next;
      });
    };

    const handleScroll = () => {
      if (animationFrame) {
        return;
      }

      animationFrame =
        window.requestAnimationFrame(
          renderMaterial
        );
    };

    renderMaterial();

    window.addEventListener(
      "scroll",
      handleScroll,
      {
        passive: true,
      }
    );

    return () => {
      window.removeEventListener(
        "scroll",
        handleScroll
      );

      if (animationFrame) {
        window.cancelAnimationFrame(
          animationFrame
        );
      }
    };
  }, []);

  return (
    <header
      className={[
        "pointer-events-none",
        "fixed",
        "left-0",
        "right-0",
        "top-0",
        "z-[100]",
        "text-white",
      ].join(" ")}
    >
      <div
        aria-hidden="true"
        ref={topFadeRef}
        className={[
          "absolute",
          "inset-x-0",
          "top-0",
          "h-32",
          "bg-gradient-to-b",
          "from-black/45",
          "to-transparent",
        ].join(" ")}
      />

      <Container className="relative">
        <div
          ref={frameRef}
          data-scrolled={scrolled}
          className={[
            styles.navbarFrame,

            scrolled
              ? styles.scrolled
              : "",

            "pointer-events-auto",
            "flex",
            "items-center",
            "justify-between",
          ].join(" ")}
        >
          <div
            aria-hidden="true"
            className={
              styles.liquidGlass
            }
          >
            <span
              aria-hidden="true"
              className={
                styles.liquidGlassSheen
              }
            />
          </div>

          <svg
            aria-hidden="true"
            className={
              styles.filterDefinitions
            }
            width="0"
            height="0"
            focusable="false"
          >
            <defs>
              <filter
                id="navbar-liquid-refraction"
                x="-18%"
                y="-18%"
                width="136%"
                height="136%"
              >
                <feTurbulence
                  type="fractalNoise"
                  baseFrequency=".012 .025"
                  numOctaves="2"
                  seed="8"
                  result="noise"
                />
                <feDisplacementMap
                  ref={displacementRef}
                  in="SourceGraphic"
                  in2="noise"
                  scale="0"
                  xChannelSelector="R"
                  yChannelSelector="B"
                />
              </filter>
            </defs>
          </svg>

          <Link
            href="/"
            aria-label={`${restaurant.identity.name} home`}
            className={[
              "group",
              "relative",
              "font-display",
              "text-xl",
              "tracking-[-0.04em]",
            ].join(" ")}
          >
            <span
              className={[
                "transition-opacity",
                "duration-300",
                "group-hover:opacity-55",
              ].join(" ")}
            >
              {
                restaurant.identity
                  .shortName ??
                restaurant.identity
                  .name
              }
            </span>

            <span
              aria-hidden="true"
              className={[
                "absolute",
                "-bottom-2",
                "left-0",
                "h-px",
                "w-full",
                "origin-right",
                "scale-x-0",
                "bg-primary",
                "transition-transform",
                "duration-500",
                "group-hover:origin-left",
                "group-hover:scale-x-100",
              ].join(" ")}
            />
          </Link>

          <nav
            aria-label="Primary navigation"
            className="hidden lg:block"
          >
            <ul className="flex items-center gap-9 xl:gap-11">
              {navigation.items.map(
                (item) => (
                  <li
                    key={
                      item.href
                    }
                  >
                    <AnimatedTextLink
                      href={
                        item.href
                      }
                      className={[
                        "font-body",
                        "text-[10px]",
                        "uppercase",
                        "tracking-[0.2em]",
                        "text-white/80",
                      ].join(" ")}
                    >
                      {
                        item.label
                      }
                    </AnimatedTextLink>
                  </li>
                )
              )}
            </ul>
          </nav>

          <MobileMenu />
        </div>
      </Container>
    </header>
  );
}
