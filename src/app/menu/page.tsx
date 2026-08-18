import Link from "next/link";

import {
  menu,
  restaurant,
} from "@/site";

import {
  Container,
} from "@/components/ui/Container";

import {
  ArrowLink,
} from "@/components/ui/ArrowLink";

export default function MenuPage() {
  const firstMenu =
    menu.menus[0];

  return (
    <main
      className={[
        "relative",
        "min-h-svh",
        "overflow-hidden",
        "bg-background",
        "text-foreground",
      ].join(" ")}
    >
      <div
        aria-hidden="true"
        className={[
          "absolute",
          "left-1/2",
          "top-1/2",
          "h-[70vh]",
          "w-[50vw]",
          "-translate-x-1/2",
          "-translate-y-1/2",
          "bg-primary/[0.08]",
          "blur-[130px]",
        ].join(" ")}
      />

      <Container className="relative z-10 pb-20 pt-36">
        <div
          className={[
            "grid",
            "min-h-[calc(100svh-9rem)]",
            "items-center",
            "gap-16",
            "lg:grid-cols-12",
          ].join(" ")}
        >
          <div className="lg:col-span-6">
            <p
              className={[
                "font-body",
                "text-[10px]",
                "uppercase",
                "tracking-[0.26em]",
                "text-primary",
              ].join(" ")}
            >
              {
                restaurant.identity.name
              }
              {" · "}
              Seasonal
            </p>

            <h1
              className={[
                "mt-6",
                "font-display",
                "text-[clamp(6rem,13vw,13rem)]",
                "leading-[0.7]",
                "tracking-[-0.065em]",
              ].join(" ")}
            >
              Menu
            </h1>

            <p
              className={[
                "mt-10",
                "max-w-md",
                "font-body",
                "text-sm",
                "leading-7",
                "text-muted",
              ].join(" ")}
            >
              A seasonal selection shaped
              by produce, fire and the
              rhythm of the evening.
            </p>

            <div className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-6">
              <Link
                href="/menu/special-dishes"
                className="group relative inline-flex min-h-14 items-center gap-7 overflow-hidden bg-primary px-7 font-body text-[10px] uppercase tracking-[0.18em] text-white shadow-[0_18px_60px_rgba(120,0,18,0.3)] focus-visible:outline-white"
              >
                <span
                  aria-hidden="true"
                  className="absolute inset-0 origin-left scale-x-0 bg-white transition-transform duration-700 ease-[cubic-bezier(.76,0,.24,1)] group-hover:scale-x-100"
                />

                <span className="relative z-10 transition-colors duration-500 group-hover:text-black">
                  Explore Special Dishes
                </span>

                <span
                  aria-hidden="true"
                  className="relative z-10 text-base transition-[color,transform] duration-500 group-hover:translate-x-1 group-hover:text-black"
                >
                  ↗
                </span>
              </Link>

              <ArrowLink href="/">
                Return Home
              </ArrowLink>
            </div>
          </div>

          <div
            className={[
              "relative",
              "lg:col-span-5",
              "lg:col-start-8",
            ].join(" ")}
          >
            <div
              aria-hidden="true"
              className={[
                "absolute",
                "-left-7",
                "top-7",
                "h-full",
                "w-full",
                "border",
                "border-white/[0.07]",
              ].join(" ")}
            />

            <div
              className={[
                "relative",
                "border",
                "border-white/10",
                "bg-[#efe9dc]",
                "px-7",
                "py-10",
                "text-[#15120f]",
                "shadow-[0_35px_100px_rgba(0,0,0,0.35)]",
                "sm:px-10",
              ].join(" ")}
            >
              <div
                className={[
                  "flex",
                  "items-start",
                  "justify-between",
                  "border-b",
                  "border-black/15",
                  "pb-7",
                ].join(" ")}
              >
                <div>
                  <p
                    className={[
                      "font-body",
                      "text-[9px]",
                      "uppercase",
                      "tracking-[0.2em]",
                      "text-black/45",
                    ].join(" ")}
                  >
                    {
                      firstMenu.subtitle
                    }
                  </p>

                  <p className="mt-3 font-display text-4xl">
                    {
                      firstMenu.title
                    }
                  </p>
                </div>

                <p className="font-accent text-4xl text-primary">
                  R
                </p>
              </div>

              <div className="mt-8 space-y-9">
                {firstMenu.categories
                  .slice(
                    0,
                    2
                  )
                  .map(
                    (
                      category
                    ) => (
                      <div
                        key={
                          category.id
                        }
                      >
                        <p
                          className={[
                            "font-body",
                            "text-[9px]",
                            "uppercase",
                            "tracking-[0.2em]",
                            "text-black/45",
                          ].join(" ")}
                        >
                          {
                            category.title
                          }
                        </p>

                        <div className="mt-4 space-y-4">
                          {category.items
                            .slice(
                              0,
                              3
                            )
                            .map(
                              (
                                item
                              ) => (
                                <div
                                  key={
                                    item.name
                                  }
                                  className="flex items-start justify-between gap-6"
                                >
                                  <div>
                                    <p className="font-display text-xl">
                                      {
                                        item.name
                                      }
                                    </p>

                                    {item.description && (
                                      <p className="mt-1 font-body text-[10px] text-black/50">
                                        {
                                          item.description
                                        }
                                      </p>
                                    )}
                                  </div>

                                  {item.price?.type ===
                                    "money" && (
                                    <p className="font-body text-xs">
                                      {
                                        item.price.amount
                                      }
                                    </p>
                                  )}
                                </div>
                              )
                            )}
                        </div>
                      </div>
                    )
                  )}
              </div>

              <p
                className={[
                  "mt-10",
                  "border-t",
                  "border-black/15",
                  "pt-6",
                  "text-center",
                  "font-body",
                  "text-[8px]",
                  "uppercase",
                  "tracking-[0.25em]",
                  "text-black/40",
                ].join(" ")}
              >
                Full page-turn experience
                arriving next
              </p>
            </div>
          </div>
        </div>
      </Container>
    </main>
  );
}
