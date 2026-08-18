"use client";

import Link from "next/link";

import {
  useEffect,
  useRef,
} from "react";

import {
  useSmoothScroll,
} from "@/components/motion/SmoothScrollProvider";

import {
  useIsomorphicLayoutEffect,
} from "@/lib/motion/useIsomorphicLayoutEffect";

import {
  ContourField,
} from "./ContourField";

import {
  FloatingGalleryCard,
} from "./FloatingGalleryCard";

import {
  galleryCanvasItems,
} from "./galleryCanvasData";

type PanState = {
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  velocityX: number;
  velocityY: number;
  dragging: boolean;
  pointerId: number | null;
  pointerX: number;
  pointerY: number;
  pointerTime: number;
  initialized: boolean;
};

type Bounds = {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
};

const clamp = (
  value: number,
  minimum: number,
  maximum: number
) =>
  Math.min(
    maximum,
    Math.max(minimum, value)
  );

export function InfiniteCanvasGallery() {
  const viewportRef =
    useRef<HTMLElement>(null);

  const planeRef =
    useRef<HTMLDivElement>(null);

  const contourRef =
    useRef<HTMLDivElement>(null);

  const titleRef =
    useRef<HTMLElement>(null);

  const coordinateRef =
    useRef<HTMLSpanElement>(null);

  const mapDotRef =
    useRef<HTMLSpanElement>(null);

  const { stop, start } =
    useSmoothScroll();

  useEffect(() => {
    stop();

    return () => {
      start();
    };
  }, [start, stop]);

  useIsomorphicLayoutEffect(() => {
    const viewport =
      viewportRef.current;

    const plane =
      planeRef.current;

    if (!viewport || !plane) {
      return;
    }

    const reducedMotion =
      window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

    const state: PanState = {
      x: 0,
      y: 0,
      targetX: 0,
      targetY: 0,
      velocityX: 0,
      velocityY: 0,
      dragging: false,
      pointerId: null,
      pointerX: 0,
      pointerY: 0,
      pointerTime: 0,
      initialized: false,
    };

    const depthLayers =
      Array.from(
        plane.querySelectorAll<HTMLElement>(
          "[data-canvas-item]"
        )
      ).map((item) => ({
        element:
          item.querySelector<HTMLElement>(
            "[data-depth-layer]"
          ),
        depth:
          Number(
            item.dataset.depth ??
              0
          ),
      }));

    const getBounds = (): Bounds => ({
      minX: Math.min(
        0,
        viewport.clientWidth -
          plane.offsetWidth
      ),
      maxX: 0,
      minY: Math.min(
        0,
        viewport.clientHeight -
          plane.offsetHeight
      ),
      maxY: 0,
    });

    const constrainTarget = (
      bounds: Bounds
    ) => {
      const nextX = clamp(
        state.targetX,
        bounds.minX,
        bounds.maxX
      );

      const nextY = clamp(
        state.targetY,
        bounds.minY,
        bounds.maxY
      );

      if (nextX !== state.targetX) {
        state.velocityX = 0;
      }

      if (nextY !== state.targetY) {
        state.velocityY = 0;
      }

      state.targetX = nextX;
      state.targetY = nextY;
    };

    const render = (
      bounds: Bounds
    ) => {
      plane.style.transform =
        `translate3d(${state.x}px, ${state.y}px, 0)`;

      const mobileDepth =
        viewport.clientWidth < 768
          ? 0.55
          : 1;

      const depthBudget =
        reducedMotion
          ? 0
          : mobileDepth;

      depthLayers.forEach(
        ({
          element,
          depth,
        }) => {
          if (!element) {
            return;
          }

          element.style.transform =
            `translate3d(${-state.x * depth * depthBudget}px, ${-state.y * depth * depthBudget}px, 0)`;
        }
      );

      if (contourRef.current) {
        const contourDepth =
          reducedMotion
            ? 0
            : 0.075;

        contourRef.current.style.transform =
          `translate3d(${-state.x * contourDepth}px, ${-state.y * contourDepth}px, 0)`;
      }

      const progressX =
        bounds.minX === 0
          ? 0
          : state.x /
            bounds.minX;

      const progressY =
        bounds.minY === 0
          ? 0
          : state.y /
            bounds.minY;

      if (coordinateRef.current) {
        coordinateRef.current.textContent =
          `${Math.round(progressX * 100)
            .toString()
            .padStart(2, "0")} / ${Math.round(progressY * 100)
            .toString()
            .padStart(2, "0")}`;
      }

      if (mapDotRef.current) {
        mapDotRef.current.style.left =
          `${progressX * 100}%`;

        mapDotRef.current.style.top =
          `${progressY * 100}%`;
      }

      if (titleRef.current) {
        const originX =
          bounds.minX * 0.045;
        const originY =
          bounds.minY * 0.05;
        const distanceFromOrigin =
          Math.hypot(
            state.x - originX,
            state.y - originY
          );
        const titleExitProgress =
          clamp(
            distanceFromOrigin / 280,
            0,
            1
          );

        titleRef.current.style.opacity =
          `${1 - titleExitProgress}`;
        titleRef.current.style.transform =
          `translate3d(0, ${-titleExitProgress * 18}px, 0)`;
      }
    };

    const initialize = () => {
      const bounds = getBounds();

      if (!state.initialized) {
        state.x =
          bounds.minX * 0.045;
        state.y =
          bounds.minY * 0.05;
        state.targetX = state.x;
        state.targetY = state.y;
        state.initialized = true;
      } else {
        constrainTarget(bounds);
        state.x = clamp(
          state.x,
          bounds.minX,
          bounds.maxX
        );
        state.y = clamp(
          state.y,
          bounds.minY,
          bounds.maxY
        );
      }

      render(bounds);
    };

    let animationFrame = 0;

    const tick = () => {
      const bounds = getBounds();

      if (
        !state.dragging &&
        !reducedMotion
      ) {
        state.targetX +=
          state.velocityX;
        state.targetY +=
          state.velocityY;

        state.velocityX *= 0.9;
        state.velocityY *= 0.9;

        if (
          Math.abs(
            state.velocityX
          ) < 0.02
        ) {
          state.velocityX = 0;
        }

        if (
          Math.abs(
            state.velocityY
          ) < 0.02
        ) {
          state.velocityY = 0;
        }
      }

      constrainTarget(bounds);

      const easing = reducedMotion
        ? 1
        : state.dragging
          ? 0.32
          : 0.14;

      state.x +=
        (state.targetX -
          state.x) *
        easing;
      state.y +=
        (state.targetY -
          state.y) *
        easing;

      render(bounds);

      animationFrame =
        window.requestAnimationFrame(
          tick
        );
    };

    const handleWheel = (
      event: WheelEvent
    ) => {
      if (event.ctrlKey) {
        return;
      }

      event.preventDefault();

      const multiplier =
        event.deltaMode === 1
          ? 16
          : event.deltaMode === 2
            ? viewport.clientHeight
            : 1;

      const deltaX =
        event.deltaX * multiplier;
      const deltaY =
        event.deltaY * multiplier;

      const diagonalX =
        Math.abs(deltaX) >
        Math.abs(deltaY) * 0.45
          ? deltaX
          : deltaY * 0.58;

      state.targetX -= diagonalX;
      state.targetY -= deltaY * 0.72;

      if (!reducedMotion) {
        state.velocityX +=
          -diagonalX * 0.035;
        state.velocityY +=
          -deltaY * 0.035;
      }
    };

    const endDrag = (
      event: PointerEvent
    ) => {
      if (
        state.pointerId !==
        event.pointerId
      ) {
        return;
      }

      state.dragging = false;
      state.pointerId = null;
      viewport.dataset.dragging =
        "false";

      if (
        viewport.hasPointerCapture(
          event.pointerId
        )
      ) {
        viewport.releasePointerCapture(
          event.pointerId
        );
      }

      if (reducedMotion) {
        state.velocityX = 0;
        state.velocityY = 0;
      }
    };

    const handlePointerDown = (
      event: PointerEvent
    ) => {
      if (
        event.button !== 0 ||
        (
          event.target as HTMLElement
        ).closest("a, button")
      ) {
        return;
      }

      state.dragging = true;
      state.pointerId =
        event.pointerId;
      state.pointerX =
        event.clientX;
      state.pointerY =
        event.clientY;
      state.pointerTime =
        performance.now();
      state.velocityX = 0;
      state.velocityY = 0;

      viewport.dataset.dragging =
        "true";

      viewport.setPointerCapture(
        event.pointerId
      );
    };

    const handlePointerMove = (
      event: PointerEvent
    ) => {
      if (
        !state.dragging ||
        state.pointerId !==
          event.pointerId
      ) {
        return;
      }

      const now =
        performance.now();
      const elapsed = Math.max(
        8,
        now - state.pointerTime
      );
      const deltaX =
        event.clientX -
        state.pointerX;
      const deltaY =
        event.clientY -
        state.pointerY;

      state.targetX += deltaX;
      state.targetY += deltaY;

      state.velocityX =
        deltaX *
        (16 / elapsed);
      state.velocityY =
        deltaY *
        (16 / elapsed);

      state.pointerX =
        event.clientX;
      state.pointerY =
        event.clientY;
      state.pointerTime = now;
    };

    const handleKeyDown = (
      event: KeyboardEvent
    ) => {
      const step = event.shiftKey
        ? 260
        : 110;

      let handled = true;

      switch (event.key) {
        case "ArrowLeft":
          state.targetX += step;
          break;
        case "ArrowRight":
          state.targetX -= step;
          break;
        case "ArrowUp":
          state.targetY += step;
          break;
        case "ArrowDown":
          state.targetY -= step;
          break;
        case "Home":
          state.targetX = 0;
          state.targetY = 0;
          break;
        case "End": {
          const bounds =
            getBounds();
          state.targetX =
            bounds.minX;
          state.targetY =
            bounds.minY;
          break;
        }
        default:
          handled = false;
      }

      if (handled) {
        event.preventDefault();
        state.velocityX = 0;
        state.velocityY = 0;
      }
    };

    initialize();

    viewport.addEventListener(
      "wheel",
      handleWheel,
      { passive: false }
    );
    viewport.addEventListener(
      "pointerdown",
      handlePointerDown
    );
    viewport.addEventListener(
      "pointermove",
      handlePointerMove
    );
    viewport.addEventListener(
      "pointerup",
      endDrag
    );
    viewport.addEventListener(
      "pointercancel",
      endDrag
    );
    viewport.addEventListener(
      "keydown",
      handleKeyDown
    );
    window.addEventListener(
      "resize",
      initialize
    );

    animationFrame =
      window.requestAnimationFrame(
        tick
      );

    return () => {
      window.cancelAnimationFrame(
        animationFrame
      );

      viewport.removeEventListener(
        "wheel",
        handleWheel
      );
      viewport.removeEventListener(
        "pointerdown",
        handlePointerDown
      );
      viewport.removeEventListener(
        "pointermove",
        handlePointerMove
      );
      viewport.removeEventListener(
        "pointerup",
        endDrag
      );
      viewport.removeEventListener(
        "pointercancel",
        endDrag
      );
      viewport.removeEventListener(
        "keydown",
        handleKeyDown
      );
      window.removeEventListener(
        "resize",
        initialize
      );
    };
  }, []);

  return (
    <main
      ref={viewportRef}
      tabIndex={0}
      role="region"
      aria-label="Restaurant gallery. Drag, scroll, or use arrow keys to explore."
      data-lenis-prevent
      data-dragging="false"
      className="relative h-dvh touch-none cursor-grab overflow-hidden overscroll-none bg-[#090908] text-white outline-none data-[dragging=true]:cursor-grabbing"
    >
      <div
        ref={planeRef}
        data-gallery-plane
        className="absolute left-0 top-0 origin-top-left will-change-transform"
        style={{
          width:
            "max(1800px, 250vw)",
          height:
            "max(1500px, 200vh)",
        }}
      >
        <div
          ref={contourRef}
          className="pointer-events-none absolute -inset-[7%] text-white/[0.105] will-change-transform"
        >
          <ContourField />
        </div>

        {galleryCanvasItems.map(
          (item, canvasIndex) => {
            if (
              item.kind ===
              "image"
            ) {
              const currentIndex =
                galleryCanvasItems
                  .slice(
                    0,
                    canvasIndex + 1
                  )
                  .filter(
                    (candidate) =>
                      candidate.kind ===
                      "image"
                  ).length - 1;

              return (
                <FloatingGalleryCard
                  key={item.id}
                  item={item}
                  index={
                    currentIndex
                  }
                />
              );
            }

            return (
              <aside
                key={item.id}
                data-canvas-item
                data-depth={
                  item.depth
                }
                className="pointer-events-none absolute"
                style={{
                  left: `${item.x}%`,
                  top: `${item.y}%`,
                  width:
                    `min(${item.maxWidth}, 72vw)`,
                }}
              >
                <div data-depth-layer>
                  <p className="font-body text-[9px] uppercase tracking-[0.24em] text-primary">
                    {item.meta}
                  </p>

                  <blockquote className="mt-4 border-t border-white/25 pt-5 font-display text-[clamp(2.1rem,3.4vw,4.6rem)] leading-[0.9] tracking-[-0.055em] text-white/88">
                    “{item.text}”
                  </blockquote>
                </div>
              </aside>
            );
          }
        )}
      </div>

      <header
        ref={titleRef}
        className="pointer-events-none absolute left-5 top-28 z-30 will-change-[transform,opacity] sm:left-8 lg:left-14 lg:top-32"
      >
        <p className="font-body text-[9px] uppercase tracking-[0.28em] text-primary">
          The restaurant · Archive
        </p>

        <h1 className="mt-3 font-display text-[clamp(3.8rem,7vw,8rem)] leading-[0.75] tracking-[-0.065em] text-white">
          Field
          <br />
          notes
        </h1>
      </header>

      <div className="pointer-events-none absolute bottom-28 left-5 z-30 sm:bottom-8 sm:left-8 lg:bottom-10 lg:left-14">
        <p className="font-body text-[9px] uppercase tracking-[0.22em] text-white/48">
          Drag · Scroll · Arrow keys
        </p>

        <p className="mt-2 font-body text-[9px] uppercase tracking-[0.18em] text-white/28">
          Position{" "}
          <span ref={coordinateRef}>
            00 / 00
          </span>
        </p>
      </div>

      <div className="pointer-events-none absolute bottom-8 left-1/2 z-30 hidden -translate-x-1/2 md:block">
        <div className="relative h-12 w-24 border border-white/20 bg-black/20 backdrop-blur-sm">
          <span
            ref={mapDotRef}
            className="absolute h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary shadow-[0_0_16px_rgba(140,0,20,0.9)]"
          />
        </div>
      </div>

      <Link
        href="/"
        className="absolute right-5 top-28 z-40 border-b border-white/30 pb-2 font-body text-[9px] uppercase tracking-[0.22em] text-white/70 transition-colors duration-300 hover:border-primary hover:text-white sm:right-8 lg:right-14 lg:top-32"
      >
        Close archive
      </Link>

      <p className="sr-only">
        The gallery is arranged on a
        large two-dimensional canvas.
        Drag with a pointer, swipe on a
        touch screen, scroll, or use the
        arrow keys to move through the
        archive.
      </p>
    </main>
  );
}
