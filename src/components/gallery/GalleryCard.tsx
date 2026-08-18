"use client";

import Image from "next/image";

import {
  useLayoutEffect,
  useRef,
} from "react";

import gsap from "gsap";

import type {
  MediaAsset,
} from "@/types/media";

type Props = {
  photo: MediaAsset;

  index: number;

  className?: string;
};

export function GalleryCard({
  photo,
  index,
  className = "",
}: Props) {
  const rootRef =
    useRef<HTMLElement>(null);

  const imageRef =
    useRef<HTMLDivElement>(null);

  const overlayRef =
    useRef<HTMLDivElement>(null);

  const captionRef =
    useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    /*
     * Set the exact resting state with GSAP,
     * not Tailwind hover classes.
     */
    gsap.set(
      imageRef.current,
      {
        scale: 1.015,

        force3D: true,

        transformOrigin:
          "50% 50%",
      }
    );

    gsap.set(
      overlayRef.current,
      {
        opacity: 0.08,
      }
    );

    gsap.set(
      captionRef.current,
      {
        yPercent: 100,
      }
    );
  }, []);

  function enter() {
    /*
     * PHOTO
     */
    gsap.to(
      imageRef.current,
      {
        scale: 1.055,

        duration: 1.35,

        ease:
          "power3.out",

        overwrite:
          "auto",

        force3D: true,
      }
    );

    /*
     * DARK TINT
     */
    gsap.to(
      overlayRef.current,
      {
        opacity: 0.23,

        duration: 0.9,

        ease:
          "power2.out",

        overwrite:
          "auto",
      }
    );

    /*
     * CAPTION
     */
    gsap.to(
      captionRef.current,
      {
        yPercent: 0,

        duration: 0.75,

        ease:
          "power3.out",

        overwrite:
          "auto",
      }
    );
  }

  function leave() {
    gsap.to(
      imageRef.current,
      {
        scale: 1.015,

        duration: 1.15,

        ease:
          "power3.inOut",

        overwrite:
          "auto",

        force3D: true,
      }
    );

    gsap.to(
      overlayRef.current,
      {
        opacity: 0.08,

        duration: 0.8,

        ease:
          "power2.out",

        overwrite:
          "auto",
      }
    );

    gsap.to(
      captionRef.current,
      {
        yPercent: 100,

        duration: 0.7,

        ease:
          "power3.inOut",

        overwrite:
          "auto",
      }
    );
  }

  return (
    <figure
      ref={rootRef}

      onPointerEnter={
        enter
      }

      onPointerLeave={
        leave
      }

      className={[
        "relative",

        "overflow-hidden",

        "cursor-pointer",

        className,
      ].join(" ")}
    >
      <div
        ref={imageRef}

        className={[
          "absolute",

          "inset-0",

          "will-change-transform",
        ].join(" ")}
      >
        <Image
          src={
            photo.src
          }

          alt={
            photo.alt
          }

          fill

          sizes="70vw"

          className="object-cover"

          style={{
            objectPosition:
              `${
                photo.focalPoint
                  ?.x ??
                50
              }% ${
                photo.focalPoint
                  ?.y ??
                50
              }%`,
          }}
        />
      </div>

      <div
        ref={overlayRef}

        aria-hidden="true"

        className={[
          "absolute",

          "inset-0",

          "bg-black",
        ].join(" ")}
      />

      <div
        ref={captionRef}

        className={[
          "absolute",

          "bottom-0",

          "left-0",

          "right-0",

          "flex",

          "items-center",

          "justify-between",

          "bg-black/70",

          "px-5",

          "py-4",

          "font-body",

          "text-[9px]",

          "uppercase",

          "tracking-[0.18em]",

          "text-white",

          "backdrop-blur-md",

          "will-change-transform",
        ].join(" ")}
      >
        <span>
          ROUGE
        </span>

        <span>
          0{index + 1}
        </span>
      </div>
    </figure>
  );
}
