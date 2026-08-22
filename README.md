# ROUGE — Luxury Restaurant & Culinary Experience Template

A high-end, cinematic restaurant template built with **Next.js 16 (App Router)**, **React 19**, **TypeScript**, **Tailwind CSS v4**, **GSAP**, and **Lenis**. Engineered for luxury culinary destinations, fine dining establishments, and upscale hospitality brands seeking an immersive digital presence.

---

## ✨ Features

- **🎭 Cinematic Motion & Scroll Architecture**
  - **Lenis Smooth Scroll** with custom easing and inertia.
  - **GSAP ScrollTrigger** stacked sections, card pinning, and reveal animations.
  - **Cloud Reveal Experience** (`/menu/special-dishes`) with additive light compositing (`mix-blend-screen`), atmospheric depth, and interactive multi-course scrolling.
  - **Dynamic Liquid Glass Navigation** featuring custom SVG displacement refraction, chromatic rims, and adaptive scroll-driven state.
  - **Infinite Canvas Gallery** (`/gallery`) with fluid draggable 2D canvas, contour field backdrop, and floating card parallax.

- **⚙️ Config-Driven & Type-Safe Architecture**
  - Fully modular configuration system powered by **Zod** runtime validation.
  - Centralized customization for restaurant identity, cuisine, location, opening hours, theme tokens, feature flags, menu items, and SEO metadata.
  - Switch themes, update menus, or modify reservation flows without touching component logic.

- **♿ Accessibility & Performance First**
  - Built-in `prefers-reduced-motion` compliance across all GSAP timelines and transition layers.
  - Pure CSS & GPU-accelerated compositing for smooth 60fps animations.
  - Static site generation (SSG) with optimized image and asset delivery.
  - Fully responsive across desktop, tablet, and mobile breakpoints.

---

## 📁 Project Structure

```text
├── public/
│   ├── image_assets/       # Cloud layers, dish assets, and atmospheric graphics
│   └── videos/             # Background video clips
├── src/
│   ├── app/                # Next.js App Router pages
│   │   ├── gallery/        # Interactive infinite canvas gallery
│   │   ├── menu/           # Menu listing and course breakdown
│   │   │   └── special-dishes/ # Immersive cloud reveal scroll experience
│   │   ├── reservation/    # Table booking & contact interface
│   │   ├── layout.tsx      # Root layout, theme injection & smooth scroll provider
│   │   └── page.tsx        # Homepage hero & stacked narrative cards
│   ├── components/
│   │   ├── gallery/        # Infinite canvas, contour field, and card components
│   │   ├── home/           # Hero section, stacked panels, and closing section
│   │   ├── layout/         # Dynamic liquid glass navbar, mobile menu & shell
│   │   ├── motion/         # Lenis provider, rolling panels, and curtain sequences
│   │   ├── special-dishes/ # GSAP scroll-driven special dish reveal
│   │   └── ui/             # Reusable UI primitives (links, containers)
│   ├── lib/
│   │   ├── motion/         # Motion helpers and reduced-motion hooks
│   │   ├── reservation/    # Reservation action handlers (Resy, OpenTable, Custom)
│   │   ├── theme/          # Dynamic CSS variable & theme generator
│   │   └── validation/     # Zod schema definitions for site configs
│   ├── site/               # Centralized site configurations
│   │   ├── config/         # Restaurant identity, navigation, reservations, theme
│   │   └── content/        # Homepage, menu data, gallery data, SEO
│   └── types/              # Comprehensive TypeScript interfaces
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js**: `v20.0.0` or higher
- **Package Manager**: `npm`, `pnpm`, `yarn`, or `bun`

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
   cd YOUR_REPO_NAME
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🛠️ Available Scripts

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts the Next.js development server with Turbopack |
| `npm run build` | Creates an optimized production build |
| `npm run start` | Runs the compiled production build locally |
| `npm run lint` | Runs ESLint to check code quality |

---

## 🎨 Customization Guide

All restaurant settings and content are managed under `src/site/`:

1. **Restaurant Identity & Hours**: Edit [`src/site/config/restaurant.ts`](src/site/config/restaurant.ts) to update name, address, contact details, and opening hours.
2. **Menu & Dishes**: Update [`src/site/content/menu.ts`](src/site/content/menu.ts) to add or edit courses, dietary badges, prices, and descriptions.
3. **Theme & Palette**: Customize accent colors, typography, background gradients, and borders in [`src/site/config/theme.ts`](src/site/config/theme.ts).
4. **Reservation Provider**: Configure OpenTable, Resy, SevenRooms, or custom modal booking in [`src/site/config/reservation.ts`](src/site/config/reservation.ts).
5. **Gallery Assets**: Add photo cards and captions in [`src/site/content/gallery.ts`](src/site/content/gallery.ts).

---

## 🚢 Deployment

The easiest way to deploy this project is via the [Vercel Platform](https://vercel.com/new):

1. Push your repository to GitHub.
2. Import your project into Vercel.
3. Vercel will automatically detect Next.js and build the application.

---

## 📄 License

This project is licensed under the MIT License — feel free to use and customize it for your projects.
