"use client";

import Link from "next/link";

import {
  useLayoutEffect,
  useRef,
} from "react";

import gsap from "gsap";

type PremiumHoverLinkProps = {
  href: string;

  children:
    React.ReactNode;

  onHoverStart?: () => void;

  onHoverEnd?: () => void;

  className?: string;
};

export function PremiumHoverLink({
  href,
  children,
  onHoverStart,
  onHoverEnd,
  className = "",
}: PremiumHoverLinkProps) {
  const labelRef =
    useRef<HTMLSpanElement>(null);

  const arrowRef =
    useRef<HTMLSpanElement>(null);

  const underlineRef =
    useRef<HTMLSpanElement>(null);

  useLayoutEffect(() => {
    gsap.set(
      underlineRef.current,
      {
        scaleX: 0,

        transformOrigin:
          "left center",
      }
    );

    gsap.set(
      [
        labelRef.current,
        arrowRef.current,
      ],
      {
        x: 0,
      }
    );
  }, []);

  function handleEnter() {
    onHoverStart?.();

    /*
     * LABEL
     */
    gsap.to(
      labelRef.current,
      {
        x: 3,

        duration: 0.72,

        ease:
          "power3.out",

        overwrite:
          "auto",
      }
    );

    /*
     * ARROW
     *
     * Slightly farther and slightly
     * slower than the label.
     */
    gsap.to(
      arrowRef.current,
      {
        x: 14,

        duration: 0.85,

        ease:
          "power3.out",

        overwrite:
          "auto",
      }
    );

    /*
     * UNDERLINE
     */
    gsap.to(
      underlineRef.current,
      {
        scaleX: 1,

        duration: 0.78,

        ease:
          "power3.inOut",

        overwrite:
          "auto",
      }
    );
  }

  function handleLeave() {
    onHoverEnd?.();

    gsap.to(
      labelRef.current,
      {
        x: 0,

        duration: 0.7,

        ease:
          "power3.out",

        overwrite:
          "auto",
      }
    );

    gsap.to(
      arrowRef.current,
      {
        x: 0,

        duration: 0.82,

        ease:
          "power3.out",

        overwrite:
          "auto",
      }
    );

    gsap.to(
      underlineRef.current,
      {
        scaleX: 0,

        duration: 0.72,

        ease:
          "power3.inOut",

        overwrite:
          "auto",
      }
    );
  }

  return (
    <Link
      href={href}

      onPointerEnter={
        handleEnter
      }

      onPointerLeave={
        handleLeave
      }

      className={[
        "relative",

        "inline-flex",

        "items-center",

        "gap-8",

        "pb-[11px]",

        "font-body",

        "text-[10px]",

        "uppercase",

        "tracking-[0.21em]",

        "text-white",

        className,
      ].join(" ")}
    >
      <span
        ref={labelRef}
        className="block will-change-transform"
      >
        {children}
      </span>

      <span
        ref={arrowRef}
        aria-hidden="true"
        className={[
          "block",

          "text-[14px]",

          "will-change-transform",
        ].join(" ")}
      >
        →
      </span>

      {/* subtle permanent line */}

      <span
        aria-hidden="true"
        className={[
          "absolute",

          "bottom-0",

          "left-0",

          "h-px",

          "w-full",

          "bg-white/25",
        ].join(" ")}
      />

      {/* animated GSAP line */}

      <span
        ref={underlineRef}
        aria-hidden="true"
        className={[
          "absolute",

          "bottom-0",

          "left-0",

          "h-px",

          "w-full",

          "bg-primary",

          "will-change-transform",
        ].join(" ")}
      />
    </Link>
  );
}
