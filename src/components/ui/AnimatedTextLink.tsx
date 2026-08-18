"use client";

import Link from "next/link";

type AnimatedTextLinkProps = {
  href: string;

  children:
    React.ReactNode;

  className?: string;

  arrow?: boolean;

  onClick?: () => void;
};

export function AnimatedTextLink({
  href,
  children,
  className = "",
  arrow = false,
  onClick,
}: AnimatedTextLinkProps) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={[
        "group",
        "inline-flex",
        "items-center",
        "gap-4",
        className,
      ].join(" ")}
    >
      <span
        className={[
          "relative",
          "block",
          "h-[1.15em]",
          "overflow-hidden",
          "leading-[1.15]",
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
          {children}
        </span>

        <span
          aria-hidden="true"
          className={[
            "absolute",
            "left-0",
            "top-full",
            "block",
            "text-primary",
            "transition-transform",
            "duration-500",
            "ease-[cubic-bezier(.76,0,.24,1)]",
            "group-hover:-translate-y-full",
          ].join(" ")}
        >
          {children}
        </span>
      </span>

      {arrow && (
        <span
          aria-hidden="true"
          className={[
            "transition-transform",
            "duration-500",
            "ease-[cubic-bezier(.76,0,.24,1)]",
            "group-hover:translate-x-2",
          ].join(" ")}
        >
          →
        </span>
      )}
    </Link>
  );
}
