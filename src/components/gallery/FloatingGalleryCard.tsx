"use client";

import Image from "next/image";

import {
  useRef,
} from "react";

import gsap from "gsap";

import type {
  CanvasImageItem,
} from "./galleryCanvasData";

export function FloatingGalleryCard({
  item,
  index,
}: {
  item: CanvasImageItem;
  index: number;
}) {
  const cardRef =
    useRef<HTMLElement>(null);

  const tiltRef =
    useRef<HTMLDivElement>(null);

  const imageRef =
    useRef<HTMLDivElement>(null);

  function handlePointerMove(
    event: React.PointerEvent
  ) {
    if (
      event.buttons !== 0 ||
      window.matchMedia(
        "(hover: none), (prefers-reduced-motion: reduce)"
      ).matches
    ) {
      return;
    }

    const bounds =
      event.currentTarget.getBoundingClientRect();

    const horizontal =
      (event.clientX -
        bounds.left) /
        bounds.width -
      0.5;

    const vertical =
      (event.clientY -
        bounds.top) /
        bounds.height -
      0.5;

    gsap.to(tiltRef.current, {
      rotateX: vertical * -4,
      rotateY: horizontal * 5,
      scale: 1.018,
      transformPerspective: 900,
      duration: 0.65,
      ease: "power3.out",
      overwrite: "auto",
    });

    gsap.to(imageRef.current, {
      scale: 1.055,
      duration: 1,
      ease: "power3.out",
      overwrite: "auto",
    });
  }

  function resetTilt() {
    gsap.to(tiltRef.current, {
      rotateX: 0,
      rotateY: 0,
      scale: 1,
      duration: 0.9,
      ease: "power3.out",
      overwrite: "auto",
    });

    gsap.to(imageRef.current, {
      scale: 1.015,
      duration: 1.1,
      ease: "power3.out",
      overwrite: "auto",
    });
  }

  return (
    <article
      ref={cardRef}
      data-canvas-item
      data-depth={item.depth}
      className="absolute select-none"
      style={{
        left: `${item.x}%`,
        top: `${item.y}%`,
        width: item.width,
      }}
    >
      <div data-depth-layer>
        <figure
          ref={tiltRef}
          onPointerMove={
            handlePointerMove
          }
          onPointerLeave={
            resetTilt
          }
          className="group relative overflow-hidden bg-surface-elevated shadow-[0_24px_70px_rgba(0,0,0,0.36)] will-change-transform"
          style={{
            aspectRatio:
              item.aspectRatio,
            transformStyle:
              "preserve-3d",
          }}
        >
          <div
            ref={imageRef}
            className="absolute -inset-[2%] scale-[1.015] will-change-transform"
          >
            <Image
              src={item.src}
              alt={item.alt}
              fill
              sizes="(max-width: 768px) 280px, 32vw"
              className="object-cover"
              style={{
                objectPosition:
                  item.objectPosition ??
                  "50% 50%",
              }}
            />
          </div>

          <div
            aria-hidden="true"
            className="absolute inset-0 bg-black/10 transition-colors duration-700 group-hover:bg-black/0"
          />
        </figure>

        <figcaption className="mt-3 flex items-start justify-between gap-5 border-t border-white/25 pt-3 font-body text-[9px] uppercase tracking-[0.2em] text-white/62">
          <span>
            {item.label}
          </span>

          <span className="shrink-0 text-white/35">
            {String(
              index + 1
            ).padStart(2, "0")}
          </span>
        </figcaption>

        <p className="mt-1 font-body text-[9px] uppercase tracking-[0.16em] text-primary/80">
          {item.meta}
        </p>
      </div>
    </article>
  );
}
