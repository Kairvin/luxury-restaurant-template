"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

import { usePathname } from "next/navigation";

import Lenis from "lenis";

import gsap from "gsap";

import {
  ScrollTrigger,
} from "gsap/ScrollTrigger";

import { theme } from "@/site";

import {
  onReducedMotionChange,
  prefersReducedMotion,
} from "@/lib/motion/reducedMotion";

gsap.registerPlugin(
  ScrollTrigger
);

/**
 * Lenis feel.
 *
 * A low `lerp` with a clamped wheel delta is what gives the
 * page its weight: individual wheel notches cannot fling the
 * page, so scrolling reads as momentum rather than as input.
 */
const LENIS_OPTIONS = {
  /** Interpolation per frame. Lower = heavier. */
  lerp: 0.06,

  /** Tames aggressive trackpads and high-resolution wheels. */
  wheelMultiplier: 0.78,

  /** Upper bound for a single wheel event, in px. */
  maxWheelDelta: 110,

  /** Anchor landing offset, clears the fixed navbar. */
  anchorOffset: -80,
} as const;

type SmoothScrollApi = {
  /**
   * The live Lenis instance, or `null` when smooth scrolling
   * is disabled by config or by `prefers-reduced-motion`.
   */
  lenis: Lenis | null;

  /** Freezes the page. Use for full-screen overlays. */
  stop: () => void;

  /** Releases a previous `stop()`. */
  start: () => void;
};

const noop = () => {};

const SmoothScrollContext =
  createContext<SmoothScrollApi>({
    lenis: null,
    stop: noop,
    start: noop,
  });

/**
 * Access to the page's scroll engine.
 *
 * Overlays must lock scrolling through this rather than by
 * setting `overflow: hidden` themselves — Lenis drives the
 * real scroll position and would happily keep scrolling
 * underneath a locked body.
 */
export function useSmoothScroll(): SmoothScrollApi {
  return useContext(
    SmoothScrollContext
  );
}

export function SmoothScrollProvider({
  children,
}: {
  children: ReactNode;
}) {
  const lenisRef =
    useRef<Lenis | null>(null);

  const pathname = usePathname();

  const [
    reducedMotion,
    setReducedMotion,
  ] = useState(
    prefersReducedMotion
  );

  /*
   * Resolved on the client only, then kept in sync. Toggling
   * the OS setting tears the smooth scroller down without a
   * reload.
  */
  useEffect(() => {
    return onReducedMotionChange(
      setReducedMotion
    );
  }, []);

  const smoothScrollEnabled =
    theme.motion.smoothScroll &&
    !reducedMotion;

  useEffect(() => {
    /*
     * Mobile browsers fire a resize every time the URL bar
     * collapses. Refreshing ScrollTrigger on those events
     * makes scroll-driven timelines jump mid-gesture.
     */
    ScrollTrigger.config({
      ignoreMobileResize: true,
    });
  }, []);

  useEffect(() => {
    if (!smoothScrollEnabled) {
      return;
    }

    const lenis = new Lenis({
      lerp:
        LENIS_OPTIONS.lerp,

      smoothWheel: true,

      wheelMultiplier:
        LENIS_OPTIONS
          .wheelMultiplier,

      /*
       * Native touch scrolling. Synthesising touch momentum
       * fights the platform's own rubber-banding and is the
       * single biggest source of jank on iOS.
       */
      syncTouch: false,

      touchMultiplier: 1,

      /* GSAP's ticker drives the loop instead of Lenis' own. */
      autoRaf: false,

      anchors: {
        offset:
          LENIS_OPTIONS
            .anchorOffset,
      },

      virtualScroll: (input) => {
        if (
          !(
            input.event instanceof
            WheelEvent
          )
        ) {
          return true;
        }

        input.deltaY =
          Math.sign(
            input.deltaY
          ) *
          Math.min(
            Math.abs(
              input.deltaY
            ),
            LENIS_OPTIONS
              .maxWheelDelta
          );

        return true;
      },
    });

    lenisRef.current = lenis;

    /*
     * Wrapped rather than passed directly: Lenis hands its own
     * instance to `scroll` listeners, and `ScrollTrigger.update`
     * reads its first argument as a `force` flag.
     */
    lenis.on("scroll", () => {
      ScrollTrigger.update();
    });

    const raf = (
      time: number
    ) => {
      /* GSAP reports seconds, Lenis expects milliseconds. */
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(raf);

    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(raf);

      lenis.destroy();

      lenisRef.current = null;
    };
  }, [smoothScrollEnabled]);

  /*
   * Measurements taken before webfonts land are wrong for any
   * section whose height is content-driven.
   */
  useEffect(() => {
    let cancelled = false;

    const frame =
      window.requestAnimationFrame(
        () => {
          ScrollTrigger.refresh();
        }
      );

    document.fonts?.ready.then(
      () => {
        if (!cancelled) {
          ScrollTrigger.refresh();
        }
      }
    );

    return () => {
      cancelled = true;

      window.cancelAnimationFrame(
        frame
      );
    };
  }, []);

  /*
   * A client navigation replaces the whole document body, so
   * every trigger's measurements are stale. Scroll position
   * itself is left to Next.js.
   */
  const isFirstRender =
    useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;

      return;
    }

    lenisRef.current?.resize();

    ScrollTrigger.refresh();
  }, [pathname]);

  const setLocked = useCallback(
    (locked: boolean) => {
      const root =
        document.documentElement;

      if (locked) {
        root.setAttribute(
          "data-scroll-locked",
          ""
        );

        lenisRef.current?.stop();

        return;
      }

      root.removeAttribute(
        "data-scroll-locked"
      );

      lenisRef.current?.start();
    },
    []
  );

  const api =
    useMemo<SmoothScrollApi>(
      () => ({
        get lenis() {
          return lenisRef.current;
        },

        stop: () =>
          setLocked(true),

        start: () =>
          setLocked(false),
      }),
      [setLocked]
    );

  return (
    <SmoothScrollContext.Provider
      value={api}
    >
      {children}
    </SmoothScrollContext.Provider>
  );
}
