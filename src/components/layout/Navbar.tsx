"use client";

import Link from "next/link";

import {
  useEffect,
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

export function Navbar() {
  const [
    scrolled,
    setScrolled,
  ] = useState(false);

  useEffect(() => {
    const handleScroll =
      () => {
        setScrolled(
          window.scrollY >
            40
        );
      };

    handleScroll();

    window.addEventListener(
      "scroll",
      handleScroll,
      {
        passive: true,
      }
    );

    return () =>
      window.removeEventListener(
        "scroll",
        handleScroll
      );
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
        className={[
          "absolute inset-0",
          "transition-all",
          "duration-700",

          scrolled
            ? [
                "bg-black/40",
                "backdrop-blur-[10px]",
                "border-b",
                "border-white/[0.07]",
              ].join(
                " "
              )
            : "bg-transparent",
        ].join(" ")}
      />

      <div
        aria-hidden="true"
        className={[
          "absolute",
          "inset-x-0",
          "top-0",
          "h-32",
          "bg-gradient-to-b",
          "from-black/45",
          "to-transparent",

          scrolled
            ? "opacity-0"
            : "opacity-100",

          "transition-opacity",
          "duration-700",
        ].join(" ")}
      />

      <Container className="relative">
        <div
          className={[
            "pointer-events-auto",
            "flex",
            "h-20",
            "items-center",
            "justify-between",
            "transition-[height]",
            "duration-500",
            "lg:h-24",

            scrolled
              ? "lg:h-[76px]"
              : "",
          ].join(" ")}
        >
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
