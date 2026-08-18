"use client";

import Image from "next/image";
import Link from "next/link";

import {
  useRef,
} from "react";

import gsap from "gsap";

import {
  ScrollTrigger,
} from "gsap/ScrollTrigger";

import {
  useIsomorphicLayoutEffect,
} from "@/lib/motion/useIsomorphicLayoutEffect";

gsap.registerPlugin(
  ScrollTrigger
);

const REVEAL_ASSETS = {
  backdrop:
    "/image_assets/cloud-backdrop.png",
  cloudLeft:
    "/image_assets/cloud-left.png",
  cloudRight:
    "/image_assets/cloud-right.png",
  foreground:
    "/image_assets/cloud-foreground.png",
  handDish:
    "/image_assets/hand-dish.png",
} as const;

export function SpecialDishReveal() {
  const sectionRef =
    useRef<HTMLElement>(null);

  const backdropRef =
    useRef<HTMLDivElement>(null);

  const subjectRef =
    useRef<HTMLDivElement>(null);

  const cloudLeftRef =
    useRef<HTMLDivElement>(null);

  const cloudRightRef =
    useRef<HTMLDivElement>(null);

  const foregroundRef =
    useRef<HTMLDivElement>(null);

  const openingNoteRef =
    useRef<HTMLDivElement>(null);

  const copyRef =
    useRef<HTMLDivElement>(null);

  const ticketRef =
    useRef<HTMLElement>(null);

  const scrollCueRef =
    useRef<HTMLDivElement>(null);

  const progressLineRef =
    useRef<HTMLSpanElement>(null);

  const progressNumberRef =
    useRef<HTMLSpanElement>(null);

  useIsomorphicLayoutEffect(() => {
    const section =
      sectionRef.current;
    const backdrop =
      backdropRef.current;
    const subject =
      subjectRef.current;
    const cloudLeft =
      cloudLeftRef.current;
    const cloudRight =
      cloudRightRef.current;
    const foreground =
      foregroundRef.current;
    const openingNote =
      openingNoteRef.current;
    const copy = copyRef.current;
    const ticket = ticketRef.current;
    const scrollCue =
      scrollCueRef.current;

    if (
      !section ||
      !backdrop ||
      !subject ||
      !cloudLeft ||
      !cloudRight ||
      !foreground ||
      !openingNote ||
      !copy ||
      !ticket ||
      !scrollCue
    ) {
      return;
    }

    const reducedMotion =
      window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

    const context = gsap.context(
      () => {
        if (reducedMotion) {
          gsap.set(
            cloudLeft,
            {
              xPercent: -96,
              yPercent: -3,
              scale: 1.06,
            }
          );
          gsap.set(
            cloudRight,
            {
              xPercent: 96,
              yPercent: -2,
              scale: 1.06,
            }
          );
          gsap.set(
            foreground,
            {
              autoAlpha: 0.12,
              yPercent: 24,
            }
          );
          gsap.set(subject, {
            autoAlpha: 1,
            xPercent: -50,
            yPercent: 0,
            scale: 1,
            zIndex: 24,
          });
          gsap.set(backdrop, {
            autoAlpha: 0.2,
            scale: 1.04,
          });
          gsap.set(
            [copy, ticket],
            {
              autoAlpha: 1,
              y: 0,
              rotate: 0,
            }
          );
          gsap.set(
            [
              openingNote,
              scrollCue,
            ],
            {
              autoAlpha: 0,
            }
          );

          return;
        }

        gsap.set(subject, {
          autoAlpha: 0.54,
          xPercent: -50,
          yPercent: 42,
          scale: 0.9,
        });
        gsap.set(backdrop, {
          autoAlpha: 0.48,
          scale: 1.16,
        });
        gsap.set(copy, {
          autoAlpha: 0,
          y: 42,
        });
        gsap.set(ticket, {
          autoAlpha: 0,
          y: 38,
          rotate: 1.6,
        });

        const timeline =
          gsap.timeline({
            defaults: {
              ease:
                "power2.inOut",
            },
            scrollTrigger: {
              trigger: section,
              start: "top top",
              end: "bottom bottom",
              scrub: 1.1,
              invalidateOnRefresh:
                true,
              onUpdate: (trigger) => {
                const value =
                  trigger.progress;

                if (
                  progressLineRef.current
                ) {
                  gsap.set(
                    progressLineRef.current,
                    {
                      scaleX:
                        value,
                    }
                  );
                }

                if (
                  progressNumberRef.current
                ) {
                  progressNumberRef.current.textContent =
                    Math.round(
                      value * 100
                    )
                      .toString()
                      .padStart(
                        2,
                        "0"
                      );
                }
              },
            },
          });

        timeline
          .to(
            openingNote,
            {
              autoAlpha: 0,
              y: -24,
              duration: 0.36,
              ease: "power2.in",
            },
            0.08
          )
          .to(
            cloudLeft,
            {
              xPercent: -96,
              yPercent: -4,
              scale: 1.09,
              duration: 1.36,
            },
            0
          )
          .to(
            cloudRight,
            {
              xPercent: 96,
              yPercent: -2,
              scale: 1.09,
              duration: 1.36,
            },
            0
          )
          .to(
            foreground,
            {
              autoAlpha: 0.08,
              yPercent: 28,
              scale: 1.08,
              duration: 1.18,
            },
            0.16
          )
          .to(
            subject,
            {
              autoAlpha: 1,
              xPercent: -50,
              yPercent: 0,
              scale: 1,
              duration: 1.56,
              ease:
                "power3.out",
            },
            0.12
          )
          .set(
            subject,
            {
              zIndex: 24,
            },
            0.92
          )
          .to(
            backdrop,
            {
              autoAlpha: 0.2,
              scale: 1.04,
              duration: 1.58,
            },
            0.02
          )
          .to(
            scrollCue,
            {
              autoAlpha: 0,
              duration: 0.28,
            },
            0.48
          )
          .to(
            copy,
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.62,
              ease:
                "power3.out",
            },
            1.08
          )
          .to(
            ticket,
            {
              autoAlpha: 1,
              y: 0,
              rotate: -1.2,
              duration: 0.58,
              ease:
                "power3.out",
            },
            1.26
          )
          .to(
            {},
            {
              duration: 0.62,
            }
          );
      },
      section
    );

    return () => {
      context.revert();
    };
  }, []);

  return (
    <main className="relative bg-[#080a09] text-white">
      <section
        ref={sectionRef}
        data-special-dish-reveal
        aria-label="Scroll to reveal tonight's special dish"
        className="relative h-[380svh] motion-reduce:h-svh md:h-[430svh] md:motion-reduce:h-svh"
      >
        <div className="sticky top-0 h-svh overflow-hidden bg-[radial-gradient(circle_at_50%_24%,#637776_0%,#273130_31%,#111514_61%,#070807_100%)]">
          <div
            ref={backdropRef}
            aria-hidden="true"
            className="absolute inset-[-8%] z-0 opacity-50 mix-blend-screen will-change-[opacity,transform]"
          >
            <Image
              src={
                REVEAL_ASSETS.backdrop
              }
              alt=""
              fill
              sizes="100vw"
              className="object-cover"
            />
          </div>

          <div
            aria-hidden="true"
            className="absolute inset-0 z-[1] bg-[radial-gradient(circle_at_50%_38%,rgba(195,218,208,0.18),rgba(4,6,5,0)_42%),linear-gradient(180deg,rgba(4,5,4,0.2)_0%,rgba(4,5,4,0.02)_42%,rgba(4,5,4,0.72)_100%)]"
          />

          <div
            ref={subjectRef}
            data-reveal-subject
            className="absolute bottom-[-27svh] left-1/2 z-10 h-[118svh] w-[78.7svh] max-w-[760px] -translate-x-1/2 origin-bottom will-change-[opacity,transform]"
          >
            <Image
              src={
                REVEAL_ASSETS.handDish
              }
              alt="A hand lifting the restaurant's fire-glazed signature dish"
              fill
              sizes="(max-width: 767px) 155vw, 760px"
              className="object-contain object-bottom drop-shadow-[0_36px_60px_rgba(0,0,0,0.32)]"
            />
          </div>

          <div
            ref={cloudLeftRef}
            aria-hidden="true"
            data-reveal-cloud="left"
            className="absolute inset-[-8%] z-20 origin-left will-change-transform"
          >
            <Image
              src={
                REVEAL_ASSETS.cloudLeft
              }
              alt=""
              fill
              sizes="115vw"
              className="object-cover"
            />
          </div>

          <div
            ref={cloudRightRef}
            aria-hidden="true"
            data-reveal-cloud="right"
            className="absolute inset-[-8%] z-20 origin-right will-change-transform"
          >
            <Image
              src={
                REVEAL_ASSETS.cloudRight
              }
              alt=""
              fill
              sizes="115vw"
              className="object-cover"
            />
          </div>

          <div
            ref={foregroundRef}
            aria-hidden="true"
            data-reveal-cloud="foreground"
            className="absolute inset-x-[-6%] bottom-[-10%] z-[25] h-[76%] will-change-[opacity,transform]"
          >
            <Image
              src={
                REVEAL_ASSETS.foreground
              }
              alt=""
              fill
              sizes="112vw"
              className="object-cover object-bottom"
            />
          </div>

          <div
            ref={openingNoteRef}
            className="pointer-events-none absolute inset-0 z-30 flex items-center justify-center px-6 text-center text-[#202522] will-change-[opacity,transform]"
          >
            <div>
              <p className="font-body text-[9px] uppercase tracking-[0.32em] text-black/55 sm:text-[10px]">
                Before it reaches the table
              </p>

              <p className="mt-4 font-display text-[clamp(3.8rem,9vw,8rem)] leading-[0.78] tracking-[-0.065em]">
                Part the
                <br />
                clouds
              </p>
            </div>
          </div>

          <div
            ref={copyRef}
            data-reveal-copy
            className="absolute bottom-[9svh] left-5 z-30 max-w-[350px] opacity-0 will-change-[opacity,transform] sm:left-8 md:bottom-auto md:top-[29%] lg:left-14"
          >
            <p className="font-body text-[9px] uppercase tracking-[0.3em] text-white/58 sm:text-[10px]">
              Rouge · From the fire
            </p>

            <h1 className="mt-4 font-display text-[clamp(4rem,7.4vw,8.2rem)] leading-[0.72] tracking-[-0.07em] text-white">
              Tonight,
              <br />
              lifted.
            </h1>

            <p className="mt-6 max-w-[280px] font-body text-xs leading-6 text-white/62 sm:text-sm sm:leading-7">
              Fire-glazed chicken,
              spring allium and red pepper,
              finished at the pass.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href="/reservation"
                className="group inline-flex min-h-12 items-center justify-center bg-white px-5 font-body text-[9px] uppercase tracking-[0.2em] transition-colors duration-500 hover:bg-primary sm:px-6"
              >
                <span className="text-black transition-colors duration-500 group-hover:text-white">
                  Book a table
                </span>
              </Link>

              <Link
                href="/menu"
                className="inline-flex min-h-12 items-center justify-center border border-white/30 px-5 font-body text-[9px] uppercase tracking-[0.2em] text-white transition-[border-color,background-color] duration-500 hover:border-white hover:bg-white/10 sm:px-6"
              >
                View menu
              </Link>
            </div>
          </div>

          <aside
            ref={ticketRef}
            data-reveal-ticket
            aria-label="Tonight's special dish details"
            className="absolute right-8 top-[32%] z-30 hidden w-[270px] bg-[#e9e5d8] px-7 py-8 text-[#161814] opacity-0 shadow-[0_30px_100px_rgba(0,0,0,0.38)] will-change-[opacity,transform] md:block lg:right-14 lg:w-[300px]"
          >
            <div className="flex items-start justify-between border-b border-black/18 pb-5">
              <p className="font-body text-[8px] uppercase tracking-[0.25em] text-black/45">
                Tonight&apos;s pass
              </p>

              <span className="font-accent text-3xl leading-none text-primary">
                R
              </span>
            </div>

            <p className="mt-7 font-display text-[2.25rem] leading-[0.9] tracking-[-0.045em]">
              Fire-glazed
              <br />
              chicken
            </p>

            <p className="mt-5 font-body text-[10px] leading-5 text-black/52">
              Spring allium · red pepper
              · house glaze
            </p>

            <p className="mt-8 border-t border-black/18 pt-5 font-body text-[8px] uppercase leading-5 tracking-[0.2em] text-black/42">
              Prepared in limited
              quantities each evening
            </p>
          </aside>

          <div
            ref={scrollCueRef}
            className="pointer-events-none absolute bottom-7 left-1/2 z-40 flex -translate-x-1/2 items-center gap-4 text-black/52 motion-reduce:hidden sm:bottom-9"
          >
            <span className="font-body text-[8px] uppercase tracking-[0.25em] sm:text-[9px]">
              Scroll to reveal
            </span>

            <span className="relative h-px w-16 overflow-hidden bg-black/20 sm:w-24">
              <span
                ref={progressLineRef}
                className="absolute inset-0 origin-left scale-x-0 bg-black/70"
              />
            </span>

            <span className="font-body text-[8px] tabular-nums tracking-[0.18em] sm:text-[9px]">
              <span ref={progressNumberRef}>
                00
              </span>
              %
            </span>
          </div>

          <Link
            href="/menu"
            className="absolute right-5 top-28 z-40 border-b border-white/30 pb-2 font-body text-[9px] uppercase tracking-[0.22em] text-white/72 transition-colors duration-300 hover:border-white hover:text-white sm:right-8 lg:right-14 lg:top-32"
          >
            Back to menu
          </Link>

          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-[26] bg-[linear-gradient(180deg,rgba(0,0,0,0.12)_0%,rgba(0,0,0,0)_28%,rgba(0,0,0,0)_58%,rgba(0,0,0,0.54)_100%)] shadow-[inset_0_0_170px_rgba(0,0,0,0.28)]"
          />
        </div>
      </section>
    </main>
  );
}
