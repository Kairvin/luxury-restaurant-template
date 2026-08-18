import type {
  HTMLAttributes,
  ReactNode,
} from "react";

type ContainerProps = {
  children: ReactNode;
  className?: string;
} & HTMLAttributes<HTMLDivElement>;

export function Container({
  children,
  className = "",
  ...props
}: ContainerProps) {
  return (
    <div
      className={[
        "mx-auto w-full max-w-[1600px]",
        "px-5 sm:px-7 lg:px-10 xl:px-14",
        className,
      ].join(" ")}
      {...props}
    >
      {children}
    </div>
  );
}
