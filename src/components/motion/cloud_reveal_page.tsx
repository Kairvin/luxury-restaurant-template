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

import {
    REDUCED_MOTION_QUERY,
} from "@/lib/motion/reducedMotion";

import type {
    CTA,
} from "@/types/homepage";

import {
    Container,
} from "@/components/ui/Container";

gsap.registerPlugin(
    ScrollTrigger
);

/* -------------------------------------------------------------------------- */
/*                                   Assets                                   */
/* -------------------------------------------------------------------------- */

/**
 * The four art layers, back to front.
 *
 * ## The stage is an additive light stack
 *
 * Read this before swapping anything, because it is the one
 * idea the whole composite rests on.
 *
 * None of these placeholders is a transparent cutout. Every one
 * is bright artwork photographed or rendered **on solid black**
 * — white cloud on black, a lit dish on black. So rather than
 * relying on an alpha channel none of them has, the stage is
 * built the way a darkroom composite is: a near-black base, and
 * every art layer `mix-blend-screen`-ed on top of it.
 *
 * Screen keeps whichever input is brighter, so:
 *
 * - Black contributes **nothing**. Every layer's rectangular
 *   frame disappears for free, and so do the black speckles and
 *   hard matte fringes left around the cloud cutouts.
 * - Bright artwork survives essentially untouched, because
 *   screening over near-black is very nearly the identity.
 * - Dense white cloud screens to opaque and genuinely hides the
 *   dish behind it — which is what makes the parting read as a
 *   reveal rather than a cross-fade.
 *
 * Screen is also commutative and associative, so the layers can
 * be reordered or restyled without the compositing maths
 * changing underneath. Light simply adds up.
 *
 * The one rule this imposes: **whatever sits behind the dish has
 * to stay dark.** Screen over a bright backdrop washes out, and
 * that is why `sky` below is deliberately dimmed and pushed
 * upward rather than run full-bleed at full strength.
 *
 * Swapping in genuinely transparent art? Drop `mix-blend-screen`
 * from that layer and it composites normally. Nothing else needs
 * to change.
 *
 * ## Sizes
 *
 * Every layer is rendered with `fill`, so Next never needs an
 * intrinsic size and there is no `width`/`height` here to drift
 * out of sync with the files. Only the aspect ratio matters,
 * since `object-cover` crops to the stage.
 *
 * Aspect ratios below were read off the placeholders visually;
 * the pixel figures are **recommended authoring sizes**, not
 * measurements of the current files:
 *
 * - `sky`        ~16:9 landscape. Author at 1920x1080.
 * - `handDish`   ~2:3 portrait.   Author at 1600x2400.
 * - `cloudLeft`  ~16:9 landscape. Author at 1920x1080.
 * - `cloudRight` ~16:9 landscape. Author at 1920x1080.
 *
 * The ratios are what the layout is tuned against; exact pixel
 * counts are free to differ, and nothing here reads them. To
 * check what is actually on disk:
 *
 *     sips -g pixelWidth -g pixelHeight public/image_assets/*.png
 *
 * ## Composition
 *
 * - `sky`        A soft cloud mass on black, used as distant
 *                haze rather than as a hero element. It is
 *                dimmed, blurred and weighted to the top of the
 *                frame, so keep the interesting part in the
 *                upper half and leave the lower middle empty —
 *                that is where the dish has to stay readable.
 *
 * - `handDish`   Bottom-anchored, dish in the upper third,
 *                forearm running off the bottom edge. The layer
 *                rises from beneath the fold, so anything in the
 *                lowest quarter is never seen. Lighting matters
 *                more than a clean cutout here: a rim light or
 *                glow behind the subject is what separates it
 *                from the stage.
 * 
   */
const HERO_ASSETS = {
    sky: "/image_assets/cloud-backdrop.png",

    handDish: "/image_assets/hand-dish.png",

    cloudLeft: "/image_assets/cloud-left.png",

    cloudRight: "/image_assets/cloud-right.png",
} as const;

/* -------------------------------------------------------------------------- */
/*                                   Tuning                                   */
/* -------------------------------------------------------------------------- */

/**
 * Every easing and duration value in the reveal, in one place.
 *
 * The timeline is scrubbed, so `duration` is not wall-clock
 * time — it is a share of the scroll runway. Only the values
 * *relative to each other* matter: a clip with duration 1.4
 * consumes twice the scroll of one with duration 0.7.
 */
const TUNING = {
    /**
     * Scroll smoothing applied on top of Lenis.
     *
     * Lenis already interpolates the scroll position, so a high
     * scrub reads as lag rather than as weight. Just enough to
     * take the edge off a trackpad flick.
     */
    scrub: 0.9,

    /**
     * Share of the runway the reveal is allowed to consume.
     *
     * The remainder is a hold beat: the composed frame sits
     * finished on screen for a moment before the next stacked
     * section begins sliding over it. Without this the reveal
     * would still be settling as the curtain starts.
     */
    revealFraction: 0.84,

    clouds: {
        /** Fully clear of the viewport, as a share of own width. */
        travel: 100,

        /** Slight push toward camera as they part. */
        scale: 1.12,

        /** A touch of lift, so the parting is not purely lateral. */
        drift: -4,

        duration: 1.4,

        ease: "power2.inOut",
    },

    subject: {
        /** Start offset, as a share of own height. */
        from: 40,
        fromScale: 0.94,

        duration: 1.55,

        /**
         * Decelerating: the dish arrives and settles rather than
         * tracking the scroll linearly to its mark.
         */
        ease: "power3.out",

        /** Overlaps the parting rather than waiting for it. */
        position: 0.12,
    },

    sky: {
        /** Recedes from a tight crop as the frame opens up. */
        fromScale: 1.18,

        /**
         * Never settles at exactly 1.
         *
         * The layer is blurred, and a blur samples the world outside
         * the element as transparent — so at scale 1 the outermost
         * few pixels fade off and leave a dim rim around the stage.
         * Overscanning slightly keeps that soft edge cropped away.
         */
        toScale: 1.04,

        fromAlpha: 0.45,

        /**
         * Held well below 1 on purpose.
         *
         * The backdrop is screen-blended, so it only ever adds
         * light, and the placeholder is a big bright cloud mass. At
         * full strength it turns the stage into a lit grey field —
         * and a screened subject over a lit field is exactly the
         * washed-out composite the additive model exists to avoid.
         * Kept here, plus the vertical mask on the layer itself, it
         * stays distant haze.
         */
        toAlpha: 0.55,

        duration: 1.6,

        ease: "power2.out",
    },

    copy: {
        /** px of travel, per the brief. */
        from: 20,

        duration: 0.62,

        stagger: 0.14,

        ease: "power3.out",

        /**
         * Starts once the curtain is roughly half open — late
         * enough that the copy lands on sky rather than on cloud.
         */
        position: 0.86,
    },

    cue: {
        duration: 0.3,

        ease: "power2.in",
    },
} as const;


/* -------------------------------------------------------------------------- */
/*                                    Types                                   */
/* -------------------------------------------------------------------------- */

export type CloudRevealHeroHighlight = {
    /** Small label above the dish name. */
    label: string;

    /** The dish or offer being promoted. */
    title: string;

    /** One line of supporting detail. */
    body: string;

    /** Optional price or course count, shown as a chip. */
    meta?: string;
};

export type CloudRevealHeroBadge = {
    /** e.g. `"4.9"`. */
    score: string;

    /** e.g. `"Guest rating"`. */
    label: string;

    /** e.g. `"512 reviews"`. */
    detail: string;
};

export type CloudRevealHeroProps = {
    restaurantName: string;

    eyebrow?: string;

    title: string;

    description?: string;

    /** Filled button. */
    primaryAction: CTA;

    /** Outlined button. */
    secondaryAction: CTA;

    highlight?: CloudRevealHeroHighlight;

    badge?: CloudRevealHeroBadge;
};

/* -------------------------------------------------------------------------- */
/*                                  Component                                 */
/* -------------------------------------------------------------------------- */

/**
 * Scroll-scrubbed hero: two cloud banks part to the sides
 * while a hand lifting the signature dish rises from beneath
 * the fold, then the copy and side card fade up.
 *
 * ## Where the scroll runway comes from
 *
 * The section is deliberately several viewports tall while the
 * visible stage is a single `position: sticky` viewport inside
 * it. That extra height is not content — it is the scroll
 * distance the scrubbed timeline is mapped onto.
 *
 * This also earns the hero its place at the top of
 * `StackedSections`. That component starts sliding the next
 * card over a given card once the card's own height has been
 * scrolled past, measured from `offsetHeight`. A one-viewport
 * hero is therefore covered from the very first pixel of
 * scroll, leaving a scrubbed timeline nowhere to run. Being
 * tall pushes the handoff out to exactly where the reveal
 * finishes.
 *
 * ## Why the trigger uses numeric scroll positions
 *
 * Inside `StackedSections` this section has a `sticky`
 * ancestor, and `getBoundingClientRect()` on anything under a
 * pinned element reports its *pinned* position rather than its
 * position in the document flow. `start: "top top"` would
 * therefore measure correctly only while the card happens to
 * be unpinned — which is exactly not the case when the page is
 * refreshed mid-scroll.
 *
 * So the range is computed from layout metrics that sticky
 * never perturbs (`offsetHeight`, plus the document offset of 
* the stack's *static* root) and handed to ScrollTrigger as
 * absolute pixel positions. Standalone — with no stack around
 * it — the section itself is static and is measured directly.
 */
export function CloudRevealHero({
    restaurantName,
    eyebrow,
    title,
    description,
    primaryAction,
    secondaryAction,
    highlight,
    badge,
}: CloudRevealHeroProps) {
    const sectionRef =
        useRef<HTMLElement>(null);

    const skyRef =
        useRef<HTMLDivElement>(null);

    const subjectRef =
        useRef<HTMLDivElement>(null);

    const cloudLeftRef =
        useRef<HTMLDivElement>(null);

    const cloudRightRef =
        useRef<HTMLDivElement>(null);

    const cueRef =
        useRef<HTMLDivElement>(null);

    useIsomorphicLayoutEffect(() => {
        const section =
            sectionRef.current;

        const sky = skyRef.current;

        const subject =
            subjectRef.current;

        const cloudLeft =
            cloudLeftRef.current;

        const cloudRight =
            cloudRightRef.current;

        const cue = cueRef.current;

        if (
            !section ||
            !sky ||
            !subject ||
            !cloudLeft ||
            !cloudRight ||
            !cue
        ) {
            return;
        }

        const reduced =
            window.matchMedia(
                REDUCED_MOTION_QUERY
            ).matches;

        /* ------------------------ measured scroll range ------------------------ */

        /*
         * Present only when the hero is a card in the sticky
         * stack. Standalone, both are null and the section is
         * measured directly.
         */
        const card =
            section.closest<HTMLElement>(
                "[data-stack-card]"
            );

        const stackRoot =
            section.closest<HTMLElement>(
                "[data-stack-root]"
            );

        let startScroll = 0;

        let runway = 0;

        const measure = () => {
            const stageHeight =
                window.innerHeight;

            if (card && stackRoot) {
                /*
                 * The stack root is in normal flow, so its rect is
                 * honest at any scroll position. Every card ahead of
                 * this one contributes its full layout height.
                 */
                let top =
                    stackRoot.getBoundingClientRect()
                        .top +
                    window.scrollY;

                for (const sibling of Array.from(
                    stackRoot.children
                )) {
                    if (sibling === card) {
                        break;
                    }

                    if (
                        sibling instanceof
                        HTMLElement
                    ) {
                        top +=
                            sibling.offsetHeight;
                    }
                }

                startScroll = top;

                runway =
                    card.offsetHeight -
                    stageHeight;

                return;
            }

            startScroll =
                section.getBoundingClientRect()
                    .top +
                window.scrollY;

            runway =
                section.offsetHeight -
                stageHeight;
        };

        /*
         * Measured before the trigger is built, so its first
         * `start`/`end` evaluation already has real numbers, then
         * re-measured on every refresh so orientation changes and
         * late webfonts stay accurate.
         */
        if (!reduced) {
            measure();

            ScrollTrigger.addEventListener(
                "refreshInit",
                measure
            );
        }

        const context = gsap.context(
            () => {
                /*
                 * `xPercent: -50` rather than leaving the Tailwind
                 * `-translate-x-1/2` in place: both write the same
                 * `transform` property, and the inline transform GSAP
                 * manages would drop the class's centring the instant
                 * it takes over. The class stays as the pre-hydration
                 * fallback; GSAP owns centring from here.
                 */
                gsap.set(subject, {
                    xPercent: -50,
                });

                /*
                 * Reduced motion gets the composed end frame, with no
                 * trigger created at all. The section collapses to a
                 * single viewport in CSS, so there is no runway left
                 * to scrub anyway.
                 */
                if (reduced) {
                    /*
                     * Collapses the runway.
                     *
                     * The `motion-reduce:` classes below already do this,
                     * but they and the `md:` runway are both media-query
                     * utilities, so which one wins comes down to
                     * stylesheet order. An inline style is not a matter
                     * of opinion — and `context.revert()` puts it back.
                     */
                    gsap.set(section, {
                        height: "100dvh",
                    });

                    gsap.set(
                        cloudLeft,
                        {
                            xPercent:
                                -TUNING.clouds
                                    .travel,
                        }
                    );

                    gsap.set(
                        cloudRight,
                        {
                            xPercent:
                                TUNING.clouds
                                    .travel,
                        }
                    );

                    gsap.set(subject, {
                        yPercent: 0,
                        scale: 1,
                        autoAlpha: 1,
                    });

                    gsap.set(sky, {
                        autoAlpha:
                            TUNING.sky.toAlpha,
                        scale:
                            TUNING.sky.toScale,
                    });

                    gsap.set(
                        "[data-hero-fade]",
                        {
                            autoAlpha: 1,
                            y: 0,
                        }
                    );

                    gsap.set(cue, {
                        autoAlpha: 0,
                    });

                    return;
                }

                /* ---------------------------- start frame --------------------------- */

                gsap.set(
                    [
                        cloudLeft,
                        cloudRight,
                    ],
                    {
                        xPercent: 0,
                        yPercent: 0,
                        scale: 1,
                        force3D: true,
                    }
                );

                gsap.set(subject, {
                    yPercent:
                        TUNING.subject.from,

                    scale:
                        TUNING.subject
                            .fromScale,

                    autoAlpha: 0.6,

                    force3D: true,
                });

                gsap.set(sky, {
                    autoAlpha:
                        TUNING.sky.fromAlpha,

                    scale:
                        TUNING.sky.fromScale,
                });

                gsap.set(
                    "[data-hero-fade]",
                    {
                        autoAlpha: 0,

                        y: TUNING.copy.from,
                    }
                );

                /* ------------------------------ timeline ---------------------------- */

                const timeline =
                    gsap.timeline({
                        defaults: {
                            force3D: true,
                        },

                        scrollTrigger: {
                            start: () =>
                                startScroll,

                            end: () =>
                                startScroll +
                                Math.max(
                                    runway *
                                    TUNING.revealFraction,
                                    1
                                ),

                            scrub:
                                TUNING.scrub,

                            invalidateOnRefresh:
                                true,

                            /*
                             * Compositor hints only while the reveal is
                             * live. Left on permanently, five full-bleed
                             * layers would each hold their own GPU layer
                             * for the whole session.
                             */
                            onToggle: (self) => {
                                gsap.set(
                                    [
                                        cloudLeft,
                                        cloudRight,
                                        subject,
                                        sky,
                                    ],
                                    {
                                        willChange:
                                            self.isActive
                                                ? "transform, opacity"
                                                : "auto",
                                    }
                                );
                            },
                        },
                    });

                timeline
                    /* Sky pulls back from its tight crop. */
                    .to(
                        sky,

                        {
                            autoAlpha:
                                TUNING.sky
                                    .toAlpha,

                            scale:
                                TUNING.sky
                                    .toScale,

                            duration:
                                TUNING.sky
                                    .duration,

                            ease: TUNING.sky
                                .ease,
                        },

                        0
                    )

                    /* Left bank exits stage left. */
                    .to(
                        cloudLeft,

                        {
                            xPercent:
                                -TUNING.clouds
                                    .travel,

                            yPercent:
                                TUNING.clouds
                                    .drift,

                            scale:
                                TUNING.clouds
                                    .scale,

                            duration:
                                TUNING.clouds
                                    .duration,

                            ease:
                                TUNING.clouds
                                    .ease,
                        },

                        0
                    )

                    /* Right bank exits stage right, in lockstep. */
                    .to(
                        cloudRight,

                        {
                            xPercent:
                                TUNING.clouds
                                    .travel,

                            yPercent:
                                TUNING.clouds
                                    .drift,

                            scale:
                                TUNING.clouds
                                    .scale,

                            duration:
                                TUNING.clouds
                                    .duration,

                            ease:
                                TUNING.clouds
                                    .ease,
                        },

                        0
                    )

                    /* The dish rises into frame. */
                    .to(
                        subject,

                        {
                            yPercent: 0,


                            scale: 1,

                            autoAlpha: 1,

                            duration:
                                TUNING.subject
                                    .duration,

                            ease:
                                TUNING.subject
                                    .ease,
                        },

                        TUNING.subject
                            .position
                    )

                    /* Cue retires as soon as the gesture is understood. */
                    .to(
                        cue,

                        {
                            autoAlpha: 0,

                            duration:
                                TUNING.cue
                                    .duration,

                            ease: TUNING.cue
                                .ease,
                        },

                        0.1
                    )

                    /*
                     * Copy and side card, in DOM order: eyebrow, title,
                     * description, buttons, then the aside.
                     */
                    .to(
                        "[data-hero-fade]",

                        {
                            autoAlpha: 1,

                            y: 0,

                            duration:
                                TUNING.copy
                                    .duration,

                            stagger:
                                TUNING.copy
                                    .stagger,

                            ease: TUNING.copy
                                .ease,
                        },

                        TUNING.copy.position
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
    }, []);
    
return (
    <section
        ref={sectionRef}
        data-cloud-reveal-hero
        aria-label={`${restaurantName} — scroll to reveal tonight's signature dish`}
        className={[
            "relative",

            /*
             * Runway, not content. The visible stage is the single
             * sticky viewport inside; this height is the scroll
             * distance the timeline is scrubbed across.
             */
            "h-[260svh]",
            "md:h-[320svh]",

            /* Reduced motion has no timeline, so it needs no runway. */
            "motion-reduce:h-dvh",
            "md:motion-reduce:h-dvh",

            "bg-background",
            "text-foreground",
        ].join(" ")}
    >
        {/*
        * The stage.
        *
        * `dvh` rather than `svh`, to stay exactly as tall as
        * the stack card around it and as `window.innerHeight`
        * in the measuring code above — an `svh` stage leaves a
        * strip of the next card showing the moment a mobile URL
        * bar collapses.
        *
        * `isolate` does double duty. It scopes the layer
        * z-indexes below to this stage rather than letting them
        * compete with the fixed navbar and reservation button,
        * and it bounds the `mix-blend-screen` group — so the art
        * layers screen against the base gradient here and not
        * against whatever the page happens to put behind them.
        *
        * About `sticky`: inside `StackedSections` it is
        * effectively inert, because the stack card wraps this in
        * an `overflow-hidden` box and that box becomes the
        * scrollport a sticky descendant resolves against. It
        * costs nothing — the card is itself pinned to the
        * viewport, so the top `dvh` of the section is exactly
        * what stays on screen either way. Kept because it is
        * what pins the stage when this hero is used on its own,
        * with no stack around it.
        */}
        <div
            className={[
                "sticky top-0",
                "h-dvh w-full",
                "overflow-hidden",
                "isolate",
            ].join(" ")}
        >
            {/* ---------------------- z-0 · back layer: sky --------------------- */}

            <div
                aria-hidden="true"
                className={[
                    "absolute inset-0 z-0",

                    /*
                     * The black the rest of the stage is screened onto,
                     * so it is near-black almost everywhere by
                     * requirement rather than by taste: every art layer
                     * above adds light, and screening bright artwork
                     * over a bright base is what washes a composite
                     * like this out.
                     *
                     * It is not flat black, though. A slight lift sits
                     * behind where the plate lands, which reads as the
                     * light the dish is lit by and gives the frame some
                     * depth before any image has loaded.
                     */
                    "bg-[radial-gradient(ellipse_70%_55%_at_50%_34%,#1B2523_0%,#0E1312_45%,#070908_78%,#050606_100%)]",
                ].join(" ")}
            />

            <div
                ref={skyRef}
                aria-hidden="true"
                className={[
                    "absolute inset-0 z-0",

                    /*
                     * Screened onto the base, like every art layer here.
                     */
                    "mix-blend-screen",

                    /*
                     * Faded out before it reaches the lower half.
                     *
                     * The placeholder is a big bright cloud mass, not a
                     * sky gradient, and run full-bleed at full strength
                     * it would put a mid-grey field directly behind the
                     * dish — the one thing the additive stack cannot
                     * survive. Confining it to the upper band keeps it
                     * reading as distant haze and keeps the air around
                     * the plate dark.
                     *
                     * Written as literal class strings, not assembled
                     * from a variable: Tailwind v4 discovers utilities by
                     * scanning source text, so a class built at runtime
                     * is never seen and its CSS never generated.
                     */
                    "[mask-image:linear-gradient(to_bottom,#000_0%,#000_30%,transparent_70%)]",
                    "[-webkit-mask-image:linear-gradient(to_bottom,#000_0%,#000_30%,transparent_70%)]",

                    "origin-center",
                ].join(" ")}
            >
                <Image
                    src={HERO_ASSETS.sky}
                    alt=""
                    fill
                    sizes="100vw"
                    loading="eager"
                    fetchPriority="high"
                    className={[
                        "object-cover",

                        /*
                         * Softened so it sits behind everything as
                         * atmosphere rather than competing with the cloud
                         * banks for detail. The blur bleeds the artwork's
                         * black edges outward, which costs nothing —
                         * screen discards black.
                         */
                        "blur-[3px]",
                    ].join(" ")}
                />
            </div>

            {/* ------------------ z-10 · subject layer: the dish ---------------- */}
            {/*
          * No glow layer behind the dish, deliberately.
          *
          * Light directly behind a screened subject is the one
          * thing that washes it out, and the placeholder already
          * carries its own rim glow. The faint lift in the base
          * gradient is all the separation this needs.
          */}

            <div
                ref={subjectRef}
                data-hero-subject
                className={[
                    "absolute z-10",

                    /*
                     * Bottom-anchored and hung below the fold: the
                     * forearm runs off the bottom edge, and the layer
                     * rises from underneath.
                     */
                    "bottom-[-14svh]",
                    "left-1/2",

                    "h-[86svh]",
                    "w-[58svh]",
                    "max-w-[560px]",

                    "md:h-[92svh]",
                    "md:w-[62svh]",
                    "md:max-w-[620px]",

                    /*
                     * Pre-hydration centring only — GSAP takes the
                     * `transform` property over on mount.
                     */
                    "-translate-x-1/2",
                    /* Growth reads as rising toward camera, not inflating. */
                    "origin-bottom",

                    /*
                     * Screened, like every other art layer — see the
                     * note on `HERO_ASSETS`. The placeholder is a lit
                     * dish on black, so screen erases its frame while
                     * leaving the food itself alone.
                     *
                     * On this wrapper rather than on the `<Image>`,
                     * because GSAP transforms this element: a transform
                     * creates a stacking context, a stacking context
                     * isolates its descendants' blending, and a screened
                     * child would find only its parent's empty backdrop
                     * and stay stubbornly black. The wrapper blends
                     * against the stage, which is the intent.
                     */
                    "mix-blend-screen",
                ].join(" ")}
            >
                <Image
                    src={
                        HERO_ASSETS.handDish
                    }
                    alt={`A hand lifting the signature dish at ${restaurantName}`}
                    fill
                    sizes="(max-width: 767px) 90vw, 620px"
                    loading="eager"
                    className={[
                        "object-contain",
                        "object-bottom",

                        /*
                         * No `drop-shadow` here, deliberately. A shadow is
                         * darkness, and screen discards darkness — the
                         * filter would cost a full-layer rasterisation
                         * pass and then render nothing at all. The lift in
                         * the base gradient does the grounding instead.
                         */
                    ].join(" ")}
                />
            </div>
            {/* ------------- z-20 · foreground layers: the cloud banks ---------- */}

            {/*
          * Both banks are inset past the stage edges so that a
          * `scale` bump cannot pull a hard edge into frame.
          *
          * Each bank is screen-blended, which is what turns a
          * rectangular white-cloud-on-black PNG into a curtain:
          * screen maps black to nothing and leaves white
          * untouched, so the frame disappears without the file
          * needing an alpha channel. It also quietly cleans up
          * the matte — the placeholders carry black speckle and
          * hard white fringing along their cut inner edges, and
          * screen drops the speckle outright while the fringe
          * just reads as a lit cloud rim.
          *
          * Dense cloud screens to opaque and genuinely hides the
          * dish; only the broken outer reaches let it through.
          * Swap in transparent clouds and this class comes off.
          *
          * The blend has to live on this wrapper rather than on
          * the `<Image>` inside it. GSAP transforms this
          * element, a transform creates a stacking context, and
          * a stacking context isolates its descendants'
          * blending — so a screen-blended child would find only
          * its parent's empty backdrop and stay stubbornly
          * black. The wrapper itself blends against the stage,
          * which is what we want.
          */}
            <div
                ref={cloudLeftRef}
                aria-hidden="true"
                data-hero-cloud="left"
                className={[
                    "pointer-events-none",
                    "absolute inset-[-6%] z-20",

                    "mix-blend-screen",

                    /*
                     * Anchored on its *inner* edge, so the scale grows
                     * the bank outward past the edge it exits toward.
                     * Anchored the other way, growing would push the
                     * bank back across the centre it is meant to be
                     * uncovering, and the reveal would fight itself.
                     */
                    "origin-right",
                ].join(" ")}
            >
                <Image
                    src={
                        HERO_ASSETS.cloudLeft
                    }
                    alt=""
                    fill
                    sizes="115vw"
                    loading="eager"
                    className="object-cover object-left"
                />
            </div>
            <div
                ref={cloudRightRef}
                aria-hidden="true"
                data-hero-cloud="right"
                className={[
                    "pointer-events-none",
                    "absolute inset-[-6%] z-20",

                    "mix-blend-screen",

                    /* Mirrored origin, same reasoning as the left bank. */
                    "origin-left",
                ].join(" ")}
            >
                <Image
                    src={
                        HERO_ASSETS.cloudRight
                    }
                    alt=""
                    fill
                    sizes="115vw"
                    loading="eager"
                    className="object-cover object-right"
                />
            </div>

            {/* --------------------- z-25 · legibility scrim -------------------- */}

            {/*
          * Sits *above* the art rather than beneath it, which is
          * the opposite of where a scrim usually goes.
          *
          * Underneath it would be pointless: the layers above
          * screen onto whatever it produces, and screening
          * discards darkness, so a dark layer below the art
          * contributes nothing at all. Above the art it does the
          * one job it is here for — putting a dark bed under the
          * headline so white type stays readable even when a
          * cloud bank drifts behind it.
          *
          *           * Normal blending, and weighted to the bottom and left
          * where the copy actually lives, so the middle of the
          * frame stays clear for the dish.
          */}
            <div
                aria-hidden="true"
                className={[
                    "pointer-events-none",
                    "absolute inset-0 z-[25]",
                    "bg-[linear-gradient(180deg,rgba(5,6,6,0.50)_0%,rgba(5,6,6,0.10)_26%,rgba(5,6,6,0.34)_64%,rgba(5,6,6,0.86)_100%)]",
                ].join(" ")}
            />

            <div
                aria-hidden="true"
                className={[
                    "pointer-events-none",
                    "absolute inset-0 z-[25]",
                    "bg-[linear-gradient(100deg,rgba(5,6,6,0.72)_0%,rgba(5,6,6,0.34)_34%,rgba(5,6,6,0)_58%)]",
                    "lg:bg-[linear-gradient(100deg,rgba(5,6,6,0.78)_0%,rgba(5,6,6,0.30)_30%,rgba(5,6,6,0)_50%)]",
                ].join(" ")}
            />

            {/* --------------------- z-30 · text and UI layer ------------------- */}

            <Container
                className={[
                    "relative z-30",
                    "flex h-full flex-col",
                    "justify-end",
                    "pb-24",
                    "pt-28",
                    "md:justify-center",
                    "md:pb-20",
                    "lg:pt-32",
                ].join(" ")}
            >
                <div
                    className={[
                        "grid",
                        "items-center",
                        "gap-10",
                        "lg:grid-cols-12",
                        "lg:gap-6",
                    ].join(" ")}
                >
                    {/* Left: headline, subtext, calls to action. */}
                    <div
                        className={[
                            "lg:col-span-4",
                            "xl:col-span-4",
                        ].join(" ")}
                    >
                        {eyebrow && (
                            <p
                                data-hero-fade
                                className={[
                                    "mb-5",
                                    "font-body",
                                    "text-[10px]",
                                    "uppercase",
                                    "tracking-[0.28em]",
                                    "text-primary",
                                ].join(" ")}
                            >
                                {eyebrow}
                            </p>
                        )}
                        <h1
                            data-hero-fade
                            className={[
                                "font-display",
                                "text-[clamp(2.75rem,5.4vw,5.25rem)]",
                                "font-normal",
                                "leading-[0.88]",
                                "tracking-[-0.045em]",
                                "text-foreground",
                                "drop-shadow-[0_4px_30px_rgba(0,0,0,0.65)]",
                            ].join(" ")}
                        >
                            {title}
                        </h1>

                        {description && (
                            <p
                                data-hero-fade
                                className={[
                                    "mt-6",
                                    "max-w-[38ch]",
                                    "font-body",
                                    "text-sm",
                                    "leading-7",
                                    "text-foreground/75",
                                    "md:text-base",
                                ].join(" ")}
                            >
                                {description}
                            </p>
                        )}

                        <div
                            data-hero-fade
                            className={[
                                "mt-9",
                                "flex",
                                "flex-wrap",
                                "items-center",
                                "gap-3",
                            ].join(" ")}
                        >
                            <Link
                                href={
                                    primaryAction
                                        .href
                                }
                                aria-label={
                                    primaryAction
                                        .ariaLabel
                                }
                                className={[
                                    "group",
                                    "relative",
                                    "inline-flex",
                                    "h-[52px]",
                                    "items-center",
                                    "justify-center",
                                    "overflow-hidden",
                                    "bg-primary",
                                    "px-8",
                                    "font-body",
                                    "text-[10px]",
                                    "font-medium",
                                    "uppercase",
                                    "tracking-[0.18em]",
                                    "text-white",
                                    "transition-colors",
                                    "duration-500",
                                    "hover:bg-primary-hover",
                                ].join(" ")}
                            >
                                {
                                    primaryAction
                                        .label
                                }
                            </Link>

                            <Link
                                href={
                                    secondaryAction
                                        .href
                                }
                                aria-label={
                                    secondaryAction
                                        .ariaLabel
                                }
                                className={[
                                    "group",
                                    "inline-flex",
                                    "h-[52px]",
                                    "items-center",
                                    "justify-center",
                                    "border",
                                    "border-white/25",
                                    "bg-white/5",
                                    "px-8",
                                    "font-body",
                                    "text-[10px]",
                                    "font-medium",
                                    "uppercase",
                                    "tracking-[0.18em]",
                                    "text-foreground",
                                    "backdrop-blur-sm",
                                    "transition-colors",
                                    "duration-500",
                                    "hover:border-white/50",
                                    "hover:bg-white/10",
                                ].join(" ")}
                            >
                                {
                                    secondaryAction
                                        .label
                                }
                            </Link>
                        </div>
                    </div>

                    {/*
              * Centre columns stay empty on large screens: this
              * is the corridor the dish rises through.
              */}
                    <div
                        aria-hidden="true"
                        className="hidden lg:col-span-4 lg:block"
                    />

                    {/*
              * Right: highlight card and review badge.
              *
              * Hidden below `lg`, where the dish already owns
              * the middle of the frame and a second column
              * would sit on top of it.
              */}
                    <div
                        className={[
                            "hidden",
                            "lg:col-span-4",
                            "lg:flex",
                            "lg:flex-col",
                            "lg:items-end",
                            "lg:gap-4",
                        ].join(" ")}
                    >
                        {highlight && (
                            <article
                                data-hero-fade
                                className={[
                                    "w-full",
                                    "max-w-[300px]",
                                    "border",
                                    "border-white/15",
                                    "bg-black/35",
                                    "p-6",
                                    "backdrop-blur-md",
                                ].join(" ")}
                            >
                                <p
                                    className={[
                                        "font-body",
                                        "text-[9px]",
                                        "uppercase",
                                        "tracking-[0.22em]",
                                        "text-primary",
                                    ].join(" ")}
                                >
                                    {
                                        highlight
                                            .label
                                    }
                                </p>

                                <h2
                                    className={[
                                        "mt-3",
                                        "font-display",
                                        "text-2xl",
                                        "leading-tight",
                                        "tracking-[-0.02em]",
                                        "text-foreground",
                                    ].join(" ")}
                                >
                                    {
                                        highlight
                                            .title
                                    }
                                </h2>

                                <p
                                    className={[
                                        "mt-3",
                                        "font-body",
                                        "text-xs",
                                        "leading-6",
                                        "text-foreground/70",
                                    ].join(" ")}
                                >
                                    {
                                        highlight
                                            .body
                                    }
                                </p>
                                {highlight.meta && (
                                    <p
                                        className={[
                                            "mt-5",
                                            "inline-block",
                                            "border",
                                            "border-white/20",
                                            "px-3",
                                            "py-1.5",
                                            "font-body",
                                            "text-[9px]",
                                            "uppercase",
                                            "tracking-[0.2em]",
                                            "text-foreground/80",
                                        ].join(" ")}
                                    >
                                        {
                                            highlight
                                                .meta
                                        }
                                    </p>
                                )}
                            </article>
                        )}

                        {badge && (
                            <div
                                data-hero-fade
                                className={[
                                    "flex",
                                    "items-center",
                                    "gap-3",
                                    "border",
                                    "border-white/15",
                                    "bg-white/5",
                                    "px-4",
                                    "py-3",
                                    "backdrop-blur-md",
                                ].join(" ")}
                            >
                                <p
                                    className={[
                                        "font-display",
                                        "text-2xl",
                                        "leading-none",
                                        "text-foreground",
                                    ].join(" ")}
                                >
                                    {badge.score}
                                </p>
                                <div>
                                    <p
                                        className={[
                                            "font-body",
                                            "text-[9px]",
                                            "uppercase",
                                            "tracking-[0.2em]",
                                            "text-foreground/70",
                                        ].join(" ")}
                                    >
                                        {badge.label}
                                    </p>

                                    <p
                                        className={[
                                            "mt-1",
                                            "font-body",
                                            "text-[9px]",
                                            "uppercase",
                                            "tracking-[0.18em]",
                                            "text-foreground/45",
                                        ].join(" ")}
                                    >
                                        {
                                            badge.detail
                                        }
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </Container>
            {/* ------------------------- z-40 · scroll cue ---------------------- */}

            <div
                ref={cueRef}
                aria-hidden="true"
                className={[
                    "pointer-events-none",
                    "absolute",
                    "bottom-6",
                    "left-1/2",
                    "z-40",
                    "-translate-x-1/2",
                    "flex",
                    "flex-col",
                    "items-center",
                    "gap-2",
                    "motion-reduce:hidden",
                ].join(" ")}
            >
                <span
                    className={[
                        "font-body",
                        "text-[9px]",
                        "uppercase",
                        "tracking-[0.24em]",
                        "text-white/50",
                    ].join(" ")}
                >
                    Scroll
                </span>

                <span
                    className={[
                        "h-10",
                        "w-px",
                        "bg-gradient-to-b",
                        "from-white/50",
                        "to-transparent",
                    ].join(" ")}
                />
            </div>
        </div>
    </section>
);
}