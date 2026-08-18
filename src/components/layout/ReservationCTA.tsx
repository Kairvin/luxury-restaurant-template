"use client";

import Link from "next/link";

import {
  usePathname,
} from "next/navigation";

import {
  useRef,
} from "react";

import gsap from "gsap";

import {
  features,
  reservation,
} from "@/site";

import {
  getReservationAction,
} from "@/lib/reservation/getReservationAction";

export function ReservationCTA() {
  const ref =
    useRef<
      HTMLAnchorElement
    >(null);

  const pathname =
    usePathname();

  if (
    !features.reservations ||
    pathname ===
      "/menu/special-dishes"
  ) {
    return null;
  }

  const action =
    getReservationAction(
      reservation
    );

  function handleMove(
    event:
      React.MouseEvent<HTMLAnchorElement>
  ) {
    if (!ref.current) {
      return;
    }

    const rect =
      ref.current.getBoundingClientRect();

    const x =
      event.clientX -
      rect.left -
      rect.width / 2;

    const y =
      event.clientY -
      rect.top -
      rect.height / 2;

    gsap.to(
      ref.current,
      {
        x: x * 0.12,
        y: y * 0.16,

        duration:
          0.45,

        ease:
          "power3.out",

        overwrite:
          true,
      }
    );
  }

  function reset() {
    if (!ref.current) {
      return;
    }

    gsap.to(
      ref.current,
      {
        x: 0,
        y: 0,

        duration:
          0.7,

        ease:
          "elastic.out(1, 0.45)",
      }
    );
  }

  const classes = [
    "group",
    "fixed",
    "bottom-5",
    "right-5",
    "z-[105]",

    "inline-flex",
    "h-[58px]",
    "items-center",
    "justify-center",

    "overflow-hidden",

    "bg-white",

    "px-7",
    "sm:bottom-7",
    "sm:right-7",
    "sm:px-8",

    "shadow-[0_16px_65px_rgba(0,0,0,0.30)]",

    "will-change-transform",
  ].join(" ");

  const content = (
    <>
      <span
        aria-hidden="true"
        className={[
          "absolute",
          "inset-0",
          "-translate-x-[101%]",
          "bg-primary",

          "transition-transform",
          "duration-700",

          "ease-[cubic-bezier(.76,0,.24,1)]",

          "group-hover:translate-x-0",
        ].join(" ")}
      />

      <span
        className={[
          "relative",
          "z-10",

          "flex",
          "items-center",
          "gap-5",

          "font-body",

          "text-[10px]",

          "font-medium",

          "uppercase",

          "tracking-[0.18em]",

          "text-black",

          "transition-colors",

          "duration-500",

          "group-hover:text-white",
        ].join(" ")}
      >
        <span
          className={[
            "relative",
            "block",
            "h-[1.1em]",
            "overflow-hidden",
          ].join(" ")}
        >
          <span
            className={[
              "block",

              "transition-transform",

              "duration-500",

              "ease-[cubic-bezier(.76,0,.24,1)]",

              "group-hover:-translate-y-full",
            ].join(" ")}
          >
            Book Reservation
          </span>

          <span
            aria-hidden="true"
            className={[
              "absolute",

              "left-0",

              "top-full",

              "block",

              "transition-transform",

              "duration-500",

              "ease-[cubic-bezier(.76,0,.24,1)]",

              "group-hover:-translate-y-full",
            ].join(" ")}
          >
            Book Reservation
          </span>
        </span>

        <span
          aria-hidden="true"
          className={[
            "transition-transform",
            "duration-500",
            "group-hover:translate-x-1",
          ].join(" ")}
        >
          ↗
        </span>
      </span>
    </>
  );

  if (!action.external) {
    return (
      <Link
        ref={ref}
        href={
          action.href
        }
        className={
          classes
        }
        onMouseMove={
          handleMove
        }
        onMouseLeave={
          reset
        }
        aria-label="Book a reservation"
      >
        {content}
      </Link>
    );
  }

  return (
    <a
      ref={ref}
      href={
        action.href
      }
      className={
        classes
      }
      onMouseMove={
        handleMove
      }
      onMouseLeave={
        reset
      }
      aria-label="Book a reservation"
    >
      {content}
    </a>
  );
}
