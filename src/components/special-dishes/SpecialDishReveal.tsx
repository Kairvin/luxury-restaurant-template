"use client";

import Image from "next/image";
import Link from "next/link";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import gsap from "gsap";

import {
  ScrollTrigger,
} from "gsap/ScrollTrigger";

import {
  useIsomorphicLayoutEffect,
} from "@/lib/motion/useIsomorphicLayoutEffect";

import {
  onReducedMotionChange,
  prefersReducedMotion,
} from "@/lib/motion/reducedMotion";

gsap.registerPlugin(
  ScrollTrigger
);

/* -------------------------------------------------------------------------- */
/*                                   Assets                                   */
/* -------------------------------------------------------------------------- */

/**
 * The five art layers, back to front.
 *
 * Measured from the files on disk:
 *
 *   cloud-backdrop.png    1672 x 941   16:9    RGB, no alpha
 *   cloud-left.png        1672 x 941   16:9    RGBA
 *   cloud-right.png       1672 x 941   16:9    RGBA
 *   cloud-foreground.png  1672 x 941   16:9    RGBA
 *   hand-dish.png         1024 x 1536  2:3     RGBA
 *
 * That alpha column is what dictates the compositing below, so
 * it is worth stating plainly: the backdrop is the *only* layer
 * without an alpha channel, which is why it — and only it —
 * carries `mix-blend-screen`. Screen discards black, so opaque
 * artwork on a black field still reads as haze. The two banks,
 * the low foreground bank and the dish all have genuine alpha
 * and composite normally, which is also why the dish can take a
 * real `drop-shadow`.
 *
 * Swapping art:
 *
 *   - Keep 16:9 for the three cloud layers and 2:3 for the
 *     dish, or re-check the crops. Every layer uses `fill`, so
 *     no intrinsic size is declared and nothing here can drift
 *     out of sync with the files — only the ratio matters,
 *     since each layer is object-cover / object-contain cropped
 *     to the stage.
 *   - If a replacement cloud or dish arrives rendered on solid
 *     black rather than transparent, that layer needs
 *     `mix-blend-screen` added and its `drop-shadow` removed —
 *     a shadow under a screened layer costs a rasterisation
 *     pass and renders nothing.
 *   - 1672px wide is enough for the banks because they are
 *     blurred, drifting haze. The dish is the sharp subject and
 *     is the one to re-export larger if it looks soft on a
 *     retina display at full height.
 *
 * To re-measure:
 *
 *     sips -g pixelWidth -g pixelHeight public/image_assets/*.png
 */
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

/* -------------------------------------------------------------------------- */
/*                                   Tuning                                   */
/* -------------------------------------------------------------------------- */

/**
 * Every from-value, easing, duration and cue position in the
 * reveal, in one place.
 *
 * The timeline is scrubbed, so `duration` is not wall-clock
 * time — it is a share of the scroll runway. Only the values
 * *relative to each other* matter: a clip with duration 1.36
 * consumes twice the scroll of one with duration 0.68. Likewise
 * `position` is the point on the timeline a clip starts, so
 * overlapping ranges are intentional — that overlap is what
 * makes the dish start rising while the banks are still parting
 * instead of waiting politely for them to finish.
 *
 * `from` and `to` are both spelled out for every clip on
 * purpose; see the note on `invalidateOnRefresh` further down.
 */
const TUNING = {
  /**
   * Scroll smoothing applied on top of Lenis.
   *
   * Lenis already interpolates the scroll position, so past
   * roughly 1.5 this stops reading as weight and starts reading
   * as lag.
   */
  scrub: 1.1,

  /**
   * Share of the runway the reveal is allowed to consume.
   *
   * The remainder is a hold beat: the composed frame — dish
   * lifted, banks gone, copy and ticket settled — sits finished
   * on screen while the last quarter of the runway scrolls
   * past. Without it the reveal would still be settling at the
   * moment the section starts to leave, and the viewer would
   * never actually see the picture they scrolled to assemble.
   */
  revealFraction: 0.75,

  /** The "Part the clouds" title, which retires first. */
  openingNote: {
    from: { autoAlpha: 1, y: 0 },
    to: { autoAlpha: 0, y: -24 },
    duration: 0.36,
    ease: "power2.in",
    position: 0.08,
  },

  /**
   * The two banks that part to the sides.
   *
   * They travel just under a full width (96%) rather than a
   * clean 100%: the wrappers are inset by -8% on every side, so
   * 96% already carries the visible edge of the art clear of
   * the stage, and stopping short keeps a sliver of haze in the
   * corners instead of leaving hard empty gutters.
   *
   * The slight vertical drift and the scale-up are what sell
   * the parting as billowing rather than as two flat panels
   * sliding off a track.
   */
  clouds: {
    left: {
      from: {
        autoAlpha: 1,
        xPercent: 0,
        yPercent: 0,
        scale: 1,
      },

      to: {
        autoAlpha: 1,
        xPercent: -96,
        yPercent: -4,
        scale: 1.09,
      },
    },

    right: {
      from: {
        autoAlpha: 1,
        xPercent: 0,
        yPercent: 0,
        scale: 1,
      },

      to: {
        autoAlpha: 1,
        xPercent: 96,
        yPercent: -2,
        scale: 1.09,
      },
    },

    /** Symmetrical: eases out of rest and back into it. */
    ease: "power2.inOut",

    duration: 1.36,
    position: 0,
  },

  /** The low bank the dish rises through, which sinks and fades. */
  foreground: {
    from: {
      autoAlpha: 1,
      yPercent: 0,
      scale: 1,
    },

    to: {
      autoAlpha: 0.3,
      yPercent: 28,
      scale: 1.08,
    },

    ease: "power2.inOut",
    duration: 1.18,
    position: 0.16,
  },

  /**
   * The dish itself.
   *
   * `xPercent: -50` is carried in both `from` and `to` rather
   * than left to the Tailwind `-translate-x-1/2`: both write
   * the same `transform` property, so the class's centring is
   * dropped the instant GSAP takes that property over. The
   * class stays as the pre-hydration fallback.
   */
  subject: {
    from: {
      autoAlpha: 1,
      xPercent: -50,
      yPercent: 82,
      scale: 0.96,
    },

    to: {
      autoAlpha: 1,
      xPercent: -50,
      yPercent: 0,
      scale: 1,
    },

    /** Decelerating: the dish arrives, then settles. */
    ease: "power3.out",

    duration: 1.56,

    /** Overlaps the parting rather than following it. */
    position: 0.12,

    /**
     * The moment the dish is promoted above the cloud banks.
     *
     * Until here it renders at z-10, *behind* the banks at
     * z-20, and that is the whole trick — the dish is genuinely
     * occluded, so the parting reads as a reveal rather than as
     * a cross-fade. By this point the banks are clear of the
     * frame, so the dish can come forward and be lit by the
     * remaining foreground haze instead of clipped by it.
     */
    liftZIndex: 24,
    liftPosition: 0.92,
  },

  /** Distant haze, which recedes as the frame opens up. */
  backdrop: {
    from: { autoAlpha: 0.48, scale: 1.16 },
    to: { autoAlpha: 0.2, scale: 1.04 },
    ease: "power2.out",
    duration: 1.58,
    position: 0.02,
  },

  /** Retires as soon as the gesture has been understood. */
  cue: {
    from: { autoAlpha: 1 },
    to: { autoAlpha: 0 },
    ease: "power2.in",
    duration: 0.28,
    position: 0.48,
  },

  /**
   * Headline block and pass ticket.
   *
   * Both land late and 0.18 apart, so they read as a stagger:
   * the dish is already composed and still before any words
   * arrive.
   */
  copy: {
    from: { autoAlpha: 0, y: 42 },
    to: { autoAlpha: 1, y: 0 },
    ease: "power3.out",
    duration: 0.62,
    position: 1.08,
  },

  ticket: {
    from: { autoAlpha: 0, y: 38, rotate: 1.6 },
    to: { autoAlpha: 1, y: 0, rotate: -1.2 },
    ease: "power3.out",
    duration: 0.58,
    position: 1.26,
  },

  /**
   * Reduced motion keeps the user-controlled reveal, but drops
   * the scale changes and rotation. The essential directions
   * remain intact: clouds move sideways and the dish moves up.
   */
  reduced: {
    ease: "none",
    duration: 1,

    copyPosition: 0.62,
    copyDuration: 0.38,
  },
} as const;

/* -------------------------------------------------------------------------- */
/*                                  Component                                 */
/* -------------------------------------------------------------------------- */

/**
 * Scroll-scrubbed reveal of tonight's special dish: two cloud
 * banks part to the sides while a hand lifting the dish rises
 * from beneath the fold, then the headline and pass ticket
 * settle in.
 *
 * ## Where the scroll runway comes from
 *
 * The section is deliberately several viewports tall while the
 * visible stage is a single `position: sticky` viewport inside
 * it. That surplus height is not content — it *is* the scroll
 * distance the scrubbed timeline is mapped onto. Change the
 * section height and you change how far the viewer has to
 * scroll to assemble the picture; change `revealFraction` and
 * you change how much of that distance is reveal versus hold.
 *
 * ## Why the range is measured rather than described
 *
 * `start: "top top"` / `end: "bottom bottom"` describes the
 * range in terms of the trigger's *rendered* box. That is fine
 * while the section is a plain static block, but it silently
 * mismeasures the moment the section gains a pinned ancestor,
 * because `getBoundingClientRect()` under a pinned element
 * reports the pinned position rather than the position in
 * document flow. This page renders the reveal on its own today,
 * so both spellings agree — but dropping the component into the
 * stacked-section layout used elsewhere on the site would
 * quietly break the descriptive form.
 *
 * So the range is computed from layout metrics that sticky
 * never perturbs — the section's `offsetHeight` minus the
 * stage's own `offsetHeight` — and handed to ScrollTrigger as
 * absolute pixel positions. Measuring the stage element rather
 * than `window.innerHeight` also keeps the arithmetic right
 * whether the stage is sized in `svh` or `dvh`, which differ by
 * the height of a mobile URL bar.
 *
 * Those pixel positions are in the same coordinate space as
 * `window.scrollY` because Lenis drives native scroll rather
 * than transforming a wrapper. If that ever changes, this
 * measurement has to change with it.
 */
export function SpecialDishReveal() {
  /**
   * Tracked in state rather than read once, so that toggling
   * the system setting re-arms the reveal instead of requiring
   * a reload.
   *
   * Read in a lazy initialiser rather than in an effect so the
   * correct timeline is built on the very first pass — seeding
   * `false` and correcting afterwards would build the full
   * timeline, paint it, then tear it down again. This is safe
   * across hydration because no rendered markup depends on the
   * value: the reduced-motion layout differences are expressed
   * as `motion-reduce:` classes, which are pure CSS, so server
   * and client emit identical HTML either way.
   */
  const [
    reducedMotion,
    setReducedMotion,
  ] = useState(
    prefersReducedMotion
  );

  useEffect(
    () =>
      onReducedMotionChange(
        setReducedMotion
      ),
    []
  );

  const sectionRef =
    useRef<HTMLElement>(null);

  const stageRef =
    useRef<HTMLDivElement>(null);

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
    const stage = stageRef.current;
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
      !stage ||
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

    /* ------------------------ measured scroll range ------------------------ */

    let startScroll = 0;

    let runway = 0;

    const measure = () => {
      startScroll =
        section.getBoundingClientRect()
          .top + window.scrollY;

      /*
       * The stage is the part that stays put, so the runway is
       * everything the section has *beyond* it.
       */
      runway =
        section.offsetHeight -
        stage.offsetHeight;
    };

    /*
     * Measured once up front so the trigger's first
     * `start`/`end` evaluation already has real numbers, then
     * re-measured on every refresh. `refreshInit` fires before
     * ScrollTrigger recalculates positions, so the functional
     * bounds below always read fresh values — which is what
     * keeps the reveal aligned across an orientation change or
     * a late webfont reflow.
     */
    measure();

    ScrollTrigger.addEventListener(
      "refreshInit",
      measure
    );

    const context = gsap.context(
      () => {
        const layers = [
          backdrop,
          subject,
          cloudLeft,
          cloudRight,
          foreground,
          openingNote,
          copy,
          ticket,
        ];

        const trigger = {
          /*
           * The numeric bounds below are what actually place
           * the reveal; the element is still handed over so
           * ScrollTrigger can sort this instance against the
           * others on the page and associate it with something
           * in the DOM for its own refresh bookkeeping.
           */
          trigger: section,

          start: () => startScroll,

          end: () =>
            startScroll +
            Math.max(
              runway *
                TUNING.revealFraction,
              1
            ),

          scrub: TUNING.scrub,

          /*
           * Re-reads the range on every refresh, which is what
           * keeps the reveal correct when the viewport changes
           * size mid-scroll.
           *
           * This is also exactly why every clip below is a
           * `fromTo` rather than a `to`. Invalidation discards
           * a tween's recorded start values; a bare `to` then
           * re-records them from whatever the DOM currently
           * says — and if the timeline had already progressed,
           * the freshly recorded start value *is* the end
           * value. Every tween collapses to a no-op and the
           * reveal strands on its end frame: dish showing,
           * nothing moving. Declaring both ends means
           * invalidation re-reads the intent instead of the
           * symptom.
           */
          invalidateOnRefresh: true,

          /*
           * Compositor hints only while the reveal is live.
           * Held permanently — as a `will-change-*` class would
           * — eight full-bleed layers would each keep their own
           * GPU layer alive for the whole session, on a page
           * the viewer may well have scrolled past.
           */
          onToggle: (self: ScrollTrigger) => {
            gsap.set(layers, {
              willChange:
                self.isActive
                  ? "transform, opacity"
                  : "auto",
            });
          },

          onUpdate: (
            self: ScrollTrigger
          ) => {
            const value =
              self.progress;

            if (
              progressLineRef.current
            ) {
              gsap.set(
                progressLineRef.current,
                { scaleX: value }
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
                  .padStart(2, "0");
            }
          },
        };

        /* --------------------------- reduced motion -------------------------- */

        /*
         * Same reveal directions with scale and rotation held
         * still. Because the motion is directly controlled by
         * scroll, the user can stop it at any point.
         */
        if (reducedMotion) {
          const gentle =
            gsap.timeline({
              defaults: {
                ease: TUNING.reduced
                  .ease,

                duration:
                  TUNING.reduced
                    .duration,
              },

              scrollTrigger: trigger,
            });

          gentle
            .fromTo(
              cloudLeft,

              {
                autoAlpha: 1,
                xPercent: 0,
                yPercent: 0,
              },

              {
                autoAlpha: 1,
                xPercent:
                  TUNING.clouds.left
                    .to.xPercent,
                yPercent:
                  TUNING.clouds.left
                    .to.yPercent,
              },

              0
            )

            .fromTo(
              cloudRight,

              {
                autoAlpha: 1,
                xPercent: 0,
                yPercent: 0,
              },

              {
                autoAlpha: 1,
                xPercent:
                  TUNING.clouds.right
                    .to.xPercent,
                yPercent:
                  TUNING.clouds.right
                    .to.yPercent,
              },

              0
            )

            .fromTo(
              foreground,

              {
                autoAlpha: 1,
                yPercent: 0,
              },

              {
                autoAlpha:
                  TUNING.foreground
                    .to.autoAlpha,
                yPercent:
                  TUNING.foreground
                    .to.yPercent,
              },

              0
            )

            .fromTo(
              subject,

              {
                autoAlpha: 1,
                xPercent: -50,
                yPercent:
                  TUNING.subject.from
                    .yPercent,
              },

              {
                autoAlpha: 1,
                xPercent: -50,
                yPercent: 0,
              },

              0
            )

            .fromTo(
              backdrop,

              {
                autoAlpha:
                  TUNING.backdrop
                    .from.autoAlpha,
              },

              {
                autoAlpha:
                  TUNING.backdrop
                    .to.autoAlpha,
              },

              0
            )

            .fromTo(
              [
                openingNote,
                scrollCue,
              ],

              { autoAlpha: 1 },

              { autoAlpha: 0 },

              0
            )

            /* The dish is fully clear before any words arrive. */
            .set(
              subject,

              {
                zIndex:
                  TUNING.subject
                    .liftZIndex,
              },

              TUNING.reduced
                .copyPosition
            )

            .fromTo(
              [copy, ticket],

              { autoAlpha: 0 },

              {
                autoAlpha: 1,

                duration:
                  TUNING.reduced
                    .copyDuration,
              },

              TUNING.reduced
                .copyPosition
            );

          return;
        }

        /* ------------------------------ timeline ----------------------------- */

        const timeline =
          gsap.timeline({
            defaults: {
              force3D: true,
            },

            scrollTrigger: trigger,
          });

        timeline
          /* Distant haze recedes from its tight crop. */
          .fromTo(
            backdrop,

            {
              ...TUNING.backdrop
                .from,
            },

            {
              ...TUNING.backdrop.to,

              ease: TUNING.backdrop
                .ease,

              duration:
                TUNING.backdrop
                  .duration,
            },

            TUNING.backdrop.position
          )

          /* The opening title retires. */
          .fromTo(
            openingNote,

            {
              ...TUNING.openingNote
                .from,
            },

            {
              ...TUNING.openingNote
                .to,

              ease:
                TUNING.openingNote
                  .ease,

              duration:
                TUNING.openingNote
                  .duration,
            },

            TUNING.openingNote
              .position
          )

          /* Left bank billows out stage left. */
          .fromTo(
            cloudLeft,

            {
              ...TUNING.clouds.left
                .from,
            },

            {
              ...TUNING.clouds.left
                .to,

              ease:
                TUNING.clouds.ease,

              duration:
                TUNING.clouds
                  .duration,
            },

            TUNING.clouds.position
          )

          /* Right bank does the same, in lockstep. */
          .fromTo(
            cloudRight,

            {
              ...TUNING.clouds.right
                .from,
            },

            {
              ...TUNING.clouds.right
                .to,

              ease:
                TUNING.clouds.ease,

              duration:
                TUNING.clouds
                  .duration,
            },

            TUNING.clouds.position
          )

          /* The low bank sinks out of the dish's way. */
          .fromTo(
            foreground,

            {
              ...TUNING.foreground
                .from,
            },

            {
              ...TUNING.foreground
                .to,

              ease:
                TUNING.foreground
                  .ease,

              duration:
                TUNING.foreground
                  .duration,
            },

            TUNING.foreground.position
          )

          /* The dish rises into frame from under the fold. */
          .fromTo(
            subject,

            {
              ...TUNING.subject.from,
            },

            {
              ...TUNING.subject.to,

              ease:
                TUNING.subject.ease,

              duration:
                TUNING.subject
                  .duration,
            },

            TUNING.subject.position
          )

          /* Promoted above the now-parted banks. */
          .set(
            subject,

            {
              zIndex:
                TUNING.subject
                  .liftZIndex,
            },

            TUNING.subject
              .liftPosition
          )

          /* Cue retires once the gesture is understood. */
          .fromTo(
            scrollCue,

            { ...TUNING.cue.from },

            {
              ...TUNING.cue.to,

              ease: TUNING.cue.ease,

              duration:
                TUNING.cue.duration,
            },

            TUNING.cue.position
          )

          /* Headline block settles in. */
          .fromTo(
            copy,

            { ...TUNING.copy.from },

            {
              ...TUNING.copy.to,

              ease: TUNING.copy.ease,

              duration:
                TUNING.copy.duration,
            },

            TUNING.copy.position
          )

          /* Then the pass ticket, landing slightly askew. */
          .fromTo(
            ticket,

            {
              ...TUNING.ticket.from,
            },

            {
              ...TUNING.ticket.to,

              ease:
                TUNING.ticket.ease,

              duration:
                TUNING.ticket
                  .duration,
            },

            TUNING.ticket.position
          );
      },

      section
    );

    return () => {
      ScrollTrigger.removeEventListener(
        "refreshInit",
        measure
      );

      context.revert();
    };
  }, [reducedMotion]);

  return (
    <main className="relative bg-[#080a09] text-white">
      <section
        ref={sectionRef}
        data-special-dish-reveal
        aria-label="Scroll to reveal tonight's special dish"
        className="relative h-[380svh] motion-reduce:h-[220svh] md:h-[430svh] md:motion-reduce:h-[240svh]"
      >
        <div
          ref={stageRef}
          className="sticky top-0 h-svh overflow-hidden bg-[radial-gradient(circle_at_50%_24%,#637776_0%,#273130_31%,#111514_61%,#070807_100%)]"
        >
          <div
            ref={backdropRef}
            aria-hidden="true"
            className="absolute inset-[-8%] z-0 opacity-50 mix-blend-screen"
          >
            <Image
              src={
                REVEAL_ASSETS.backdrop
              }
              alt=""
              fill
              sizes="100vw"
              preload
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
            className="absolute bottom-[-27svh] left-1/2 z-10 h-[118svh] w-[78.7svh] max-w-[760px] -translate-x-1/2 origin-bottom"
          >
            <Image
              src={
                REVEAL_ASSETS.handDish
              }
              alt="A hand lifting the restaurant's fire-glazed signature dish"
              fill
              sizes="(max-width: 767px) 155vw, 760px"
              preload
              className="object-contain object-bottom drop-shadow-[0_36px_60px_rgba(0,0,0,0.32)]"
            />
          </div>

          <div
            ref={cloudLeftRef}
            aria-hidden="true"
            data-reveal-cloud="left"
            className="absolute inset-[-8%] z-20 origin-left"
          >
            <Image
              src={
                REVEAL_ASSETS.cloudLeft
              }
              alt=""
              fill
              sizes="115vw"
              loading="eager"
              className="object-cover"
            />
          </div>

          <div
            ref={cloudRightRef}
            aria-hidden="true"
            data-reveal-cloud="right"
            className="absolute inset-[-8%] z-20 origin-right"
          >
            <Image
              src={
                REVEAL_ASSETS.cloudRight
              }
              alt=""
              fill
              sizes="115vw"
              loading="eager"
              className="object-cover"
            />
          </div>

          <div
            ref={foregroundRef}
            aria-hidden="true"
            data-reveal-cloud="foreground"
            className="absolute inset-x-[-6%] bottom-[-10%] z-[25] h-[76%]"
          >
            <Image
              src={
                REVEAL_ASSETS.foreground
              }
              alt=""
              fill
              sizes="112vw"
              loading="eager"
              className="object-cover object-bottom"
            />
          </div>

          <div
            ref={openingNoteRef}
            className="pointer-events-none absolute inset-0 z-30 flex items-center justify-center px-6 text-center text-[#202522]"
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
            className="absolute bottom-[9svh] left-5 z-30 max-w-[350px] opacity-0 sm:left-8 md:bottom-auto md:top-[29%] lg:left-14"
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
            className="absolute right-8 top-[32%] z-30 hidden w-[270px] bg-[#e9e5d8] px-7 py-8 text-[#161814] opacity-0 shadow-[0_30px_100px_rgba(0,0,0,0.38)] md:block lg:right-14 lg:w-[300px]"
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
            className="pointer-events-none absolute bottom-7 left-1/2 z-40 flex -translate-x-1/2 items-center gap-4 text-black/52 sm:bottom-9"
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
