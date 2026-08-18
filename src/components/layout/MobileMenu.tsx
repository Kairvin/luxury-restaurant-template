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
  useSmoothScroll,
} from "@/components/motion/SmoothScrollProvider";

export function MobileMenu() {
  const [open, setOpen] =
    useState(false);

  const { start, stop } =
    useSmoothScroll();

  /*
   * Lenis owns the scroll position, so locking the body alone
   * would leave the page scrolling behind the overlay.
   */
  useEffect(() => {
    if (open) {
      stop();
    } else {
      start();
    }

    return () => {
      start();
    };
  }, [open, start, stop]);

  useEffect(() => {
    function handleKeyDown(
      event: KeyboardEvent
    ) {
      if (
        event.key === "Escape"
      ) {
        setOpen(false);
      }
    }

    window.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, []);

  return (
    <>
      <button
        type="button"
        onClick={() =>
          setOpen(true)
        }
        className={[
          "font-body text-[10px]",
          "uppercase tracking-[0.2em]",
          "lg:hidden",
        ].join(" ")}
        aria-label="Open navigation menu"
        aria-expanded={open}
      >
        Menu
      </button>

      <div
        className={[
          "fixed inset-0 z-[110]",
          "bg-background text-foreground",
          "transition-[clip-path]",
          "duration-700",
          "ease-[cubic-bezier(.76,0,.24,1)]",

          open
            ? "pointer-events-auto [clip-path:inset(0_0_0_0)]"
            : "pointer-events-none [clip-path:inset(0_0_100%_0)]",
        ].join(" ")}
        aria-hidden={!open}
      >
        <div className="flex h-full flex-col px-5 py-7 sm:px-7">
          <div className="flex items-center justify-between">
            <p className="font-display text-xl tracking-[-0.03em]">
              {
                restaurant.identity
                  .shortName ??
                restaurant.identity
                  .name
              }
            </p>

            <button
              type="button"
              onClick={() =>
                setOpen(false)
              }
              className="font-body text-[10px] uppercase tracking-[0.2em]"
              aria-label="Close navigation menu"
            >
              Close
            </button>
          </div>

          <nav
            className="flex flex-1 items-center"
            aria-label="Mobile navigation"
          >
            <ul className="w-full">
              {navigation.items.map(
                (item, index) => (
                  <li
                    key={item.href}
                    className="border-b border-border"
                  >
                    <Link
                      href={item.href}
                      onClick={() =>
                        setOpen(false)
                      }
                      className={[
                        "group flex items-baseline",
                        "justify-between py-5",
                      ].join(" ")}
                    >
                      <span className="font-display text-[clamp(2.8rem,13vw,5rem)] leading-none tracking-[-0.05em]">
                        {item.label}
                      </span>

                      <span className="font-body text-[10px] text-primary">
                        0
                        {index + 1}
                      </span>
                    </Link>
                  </li>
                )
              )}
            </ul>
          </nav>

          <div className="border-t border-border pt-5">
            <p className="max-w-xs font-body text-xs leading-5 text-muted">
              {
                restaurant.identity
                  .tagline
              }
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
