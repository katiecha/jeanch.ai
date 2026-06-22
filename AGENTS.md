<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

---

# jeanch.ai — Project Standards

## Project Overview

A Father's Day gift website themed around Bald Head Island, NC. The experience is a 3D ocean exploration game where the user sails a boat to discover islands, each holding a photo gallery. Built for one recipient (Dad / "Captain Chai").

---

## Commands

- Dev: `npm run dev`
- Build: `npm run build`
- Lint: `npm run lint`

---

## Stack

- Next.js 16 (App Router)
- TypeScript (strict mode)
- Tailwind CSS v4
- React Three Fiber v9 + Three.js + Drei
- No database, no auth, no API routes — static gift site

### 3D Layer

**React Three Fiber (R3F)** wraps Three.js in React. The `<Canvas>` in `SailboatScene.tsx` is the scene entry point.

**Drei** utilities used: `<Html>` (anchors DOM to 3D world position).

**`useFrame()`** fires every animation frame. Used in:
- `Ocean.tsx` — sine-wave water vertex animation
- `Sailboat.tsx` — input, movement, camera, island proximity
- `FishSchool.tsx` — fish swimming animation
- `Island.tsx` (GrassTuft) — grass swaying

**Geometry:** `boxGeometry`, `cylinderGeometry`, `planeGeometry`, `sphereGeometry` — no external model files.

---

## Code Conventions

- Named exports only — no default exports (except `page.tsx`, required by Next.js)
- `"use client"` only on leaf components that need browser APIs or R3F hooks
- Server components by default
- One component or hook per file
- Function declarations for components, not arrow functions
- Semantic `key` props in `.map()` — never index-based
- Files: kebab-case. Components: PascalCase. Functions: camelCase. Constants: UPPER_SNAKE_CASE.

---

## App Routes

| Route | Purpose | Unlock condition |
|---|---|---|
| `/happy-fathers-day` | Entry point — 3D ocean scene | Always accessible |
| `/ferry-dock` | Photo gallery | Always unlocked |
| `/old-baldy` | Photo gallery | Always unlocked |
| `/old-boat-house` | Photo gallery | Always unlocked |
| `/marsh-island` | Photo gallery | Always unlocked |
| `/shoals-club` | Photo gallery | Always unlocked |
| `/commons-tower` | Final gallery (fade-in) | Always unlocked |
| `/` | Secret map — graph of all nodes | Unlocked after visiting all islands |

---

## Island Names (display title → route → 3D object)

| Display title | Route | 3D monument |
|---|---|---|
| Ferry Dock | `/ferry-dock` | Wood pier + two-deck ferry boat |
| Old Baldy | `/old-baldy` | Tapered lighthouse with lantern room |
| Aunty Karon's House | `/old-boat-house` | Purple raised beach house on stilts |
| Marsh | `/marsh-island` | Two marsh banks, stream, reeds, cattails, crane |
| SHOAL | `/shoals-club` | Sandy dune with animated grass tufts |
| Bald Head Island Club | `/commons-tower` | Golf cart, gold mound, flag — no label shown in 3D |

**Renaming:** update `title` in `lib/graph.ts` first, then update the matching `page.tsx` title prop. Internal IDs and routes (e.g. `old-boat-house`) do not need to change.

---

## Discovery System

- Visited state: `localStorage` key `"visited-nodes"` (managed by `lib/discovery.ts`)
- Map unlock: `localStorage` key `"found-map"` — set when all `MAP_UNLOCK_REQUIRES` nodes visited
- `lib/graph.ts` is the single source of truth for node IDs, titles, routes, and world positions

### Graph Topology

```
happy-fathers-day  (entry page — not a 3D island)
├── ferry-dock
├── old-baldy
├── old-boat-house
└── marsh-island
         ↓
      shoals-club
         ↓
    commons-tower
```

All islands are currently always unlocked (`requires: []` or undefined).

---

## Photos

All photos live in `public/photos/`. Current distribution:

| Island | Photos |
|---|---|
| Ferry Dock | DSC_0285.jpeg, IMG_0086.JPG, IMG_0542.jpeg, IMG_0770.JPG |
| Old Baldy | IMG_1244.jpeg, IMG_1472.jpeg, IMG_1610.JPG, IMG_1742.JPG |
| Aunty Karon's House | IMG_5051.JPG, IMG_5191.JPG, IMG_8270.JPG |
| Marsh | (marsh-island page) |
| SHOAL | IMG_6970.JPG, IMG_7173.JPG, IMG_8268.JPG |
| Bald Head Island Club | IMG_9510.jpeg, IMG_9593.jpeg, Picture 055.JPG |

---

## 3D Scene

**Lighting:** High ambient (`intensity={2.0}`), moderate directional (`intensity={1.2}`).

**Ocean:** Custom GLSL vertex+fragment shader in `Ocean.tsx`. Alpha `0.72` (semi-transparent so fish beneath are visible). Wave height drives foam bands.

**Islands:** Sandy cylinder base (top radius 4.5, bottom 5.5). Each island has a unique hand-built monument and animated `GrassTuft` plants. All islands except Bald Head Island Club display a floating name label above them.

**Fish:** Animated fish swim below the ocean surface (y = −1 to −4) at various depths and speeds. Rendered in `FishSchool.tsx`, used in both the sailing scene (`SailboatScene.tsx`) and gallery background (`GalleryOceanBackground.tsx`).

---

## Controls

| Input | Action |
|---|---|
| W / ↑ | Sail forward |
| S / ↓ | Reverse |
| A / ← | Turn left |
| D / → | Turn right |
| Space | Enter nearest unlocked island |
| Mouse move | Tilt camera |
| Click island or white dot | Enter island |
| ⌂ button (bottom-right) | Reset boat to start |

---

## Visual Design

**Geometry first.** Cubes, cylinders, platforms — no organic blobs or decorative flourishes.

**Colour palette:**
| Role | Value |
|---|---|
| Deep navy (primary) | `#002147` |
| Yale blue (secondary) | `#00356b` |
| Page background | `#e8eff7` |
| Island sand | `#ddc888` / `#f0e0a8` |

**Typography:** Micro-labels `font-mono tracking-[0.6–0.8em] uppercase text-[7–10px]`. Generous whitespace.

**PhotoPage:** Polaroid-style cards with slight rotation. Clicking opens a full-screen lightbox (click anywhere or press Escape to close). Ocean background behind the gallery uses `GalleryOceanBackground.tsx`.

**Map page (`/`):** SVG graph, square nodes, thin edges. Clicking a node navigates to that route.
