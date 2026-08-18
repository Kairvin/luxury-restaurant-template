"use client";

import {
  PremiumHoverLink,
} from "./PremiumHoverLink";

type ArrowLinkProps = {
  href: string;

  children:
    React.ReactNode;

  className?: string;
};

export function ArrowLink({
  href,
  children,
  className = "",
}: ArrowLinkProps) {
  return (
    <PremiumHoverLink
      href={href}

      className={
        className
      }
    >
      {children}
    </PremiumHoverLink>
  );
}
