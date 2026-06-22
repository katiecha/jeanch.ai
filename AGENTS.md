<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

---

# jeanch.ai — Project Standards

## Project Overview

A Father's Day gift website themed around Bald Head Island, NC. The experience is a 3D ocean exploration game where the user sails a boat to discover islands, each of which holds a photo gallery. Built for one recipient (Dad / "Captain Chai") — prioritise emotional resonance and visual craft over feature completeness.

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
- No database, no auth, no API routes — this is a static gift site

### 3D Layer

**Three.js** is the WebGL engine — geometry, materials, lights, and the scene graph.

**React Three Fiber (R3F)** wraps Three.js in React. Instead of imperative `new THREE.Mesh()` calls you write JSX: `<mesh>`, `<boxGeometry>`, `<meshStandardMaterial>`. The `<Canvas>` in `SailboatScene.tsx` is the scene entry point.

**Drei** is a utility belt for R3F. Used components:
- `<Sky>` — procedural atmospheric sky shader (sun position, turbidity, rayleigh)
- `<Html>` — anchors a DOM element (the Enter button) to a 3D world position

**`useFrame()`** is the render loop hook — fires every animation frame. Used in:
- `Ocean.tsx` — mutates vertex positions each frame to produce sine-wave water ripple
- `Sailboat.tsx` — reads keyboard/mouse input, moves the boat, repositions the camera, checks island proximity
- `Island.tsx` (inside `GrassTuft`) — sways grass with sine/cosine oscillation

**Geometry primitives used:** `boxGeometry`, `cylinderGeometry`, `planeGeometry`, `sphereGeometry` — all Three.js built-ins, no external 3D model files.

---

## Code Conventions

- Named exports only — no default exports (except page.tsx files, which Next.js requires as default)
- `"use client"` only on leaf components that need browser APIs or R3F hooks
- Server components by default
- Co-locate code where it's used
- One component or hook per file
- Function declarations for components, not arrow function assignments
- Semantic `key` props in `.map()` — never index-based
- Files: kebab-case
- Components: PascalCase
- Functions: camelCase
- Constants: UPPER_SNAKE_CASE
- Hooks: useX

---

## Accessibility

- Semantic HTML throughout (`<section>`, `<nav>`, `<ul>`, `<li>`, etc.)
- `lang="en"` on `<html>`
- All `target="_blank"` links must have `rel="noopener noreferrer"`

---

## Performance

- Always use `next/image` with explicit `width` and `height` props
- For `fill` images, always provide a `sizes` prop

---

## Responsive

- Mobile-first; use a single breakpoint (`md` / 768px)
- Avoid `sm`, `lg`, `xl` breakpoints

---

## Scope

- Default to localized changes; don't refactor unrelated code
- Ask before making systemic changes that affect shared patterns

---

## Visual Design — Monument Valley Aesthetic

The source of truth for all visual decisions is `style.md`. Key principles:

**Geometry first.** Use cubes, boxes, cylinders, platforms, towers. Avoid organic shapes (no cones for trees, no blobs, no decorative flourishes).

**Extreme visual reduction.** Every element must justify its existence. Flat surfaces, clean edges. Remove texture noise, realistic materials, excessive shadows, decorative effects.

**One focal point per screen.** One primary object, one primary action, minimal visual competition.

**Restrained colour system.** 1–2 dominant colours + 1 supporting + 1 accent. Muted, soft, harmonious.

**Deliberate motion.** Slow, smooth, predictable. No bouncy effects, no attention-seeking animations. Transition durations: 300–600ms.

**Typography.** Large confident headings. Generous spacing. Micro-labels in `font-mono tracking-[0.6–0.8em] uppercase text-[7–10px]`. Text should feel carved in, not layered on.

**Whitespace is a material.** Large margins, few elements per screen, strong alignment.

---

## Colour Palette

| Role | Value |
|---|---|
| Deep navy (primary text / fill) | `#002147` |
| Yale blue (secondary) | `#00356b` |
| Page background | `#e8eff7` |
| White (cards, polaroids, modal) | `#ffffff` |
| Ocean | `#7dd4e8` |
| Island sand base | `#ddc888` / `#f0e0a8` |
| Monument stone | `#f0eadc` / `#e0d8c4` / `#c8bea8` |

Avoid: high saturation, large numbers of colours, dark heavy backgrounds on content pages.

---

## App Routes

| Route | Purpose | Unlock condition |
|---|---|---|
| `/happy-fathers-day` | Entry point — 3D ocean scene | Always accessible |
| `/ferry-dock` | Photo gallery | Unlocked from start |
| `/old-baldy` | Photo gallery | Unlocked from start |
| `/old-boat-house` | Photo gallery | Unlocked from start |
| `/shoals-club` | Photo gallery | Requires ferry-dock + old-baldy + old-boat-house visited |
| `/commons-tower` | Final gallery (fade-in) | Requires shoals-club visited |
| `/` | Secret map — graph of all nodes | Unlocked after visiting shoals-club |

---

## Island Naming Convention

Islands are named after real Bald Head Island, NC landmarks (from the official guide map):

- **Ferry Dock** — where every visit begins
- **Old Baldy** — NC's oldest lighthouse (Est. 1817) — rendered as a lighthouse in 3D
- **Old Boat House** — Est. 1903 — rendered as a tall narrow tower with crane arm
- **Shoals Club** — rendered as two columns joined by a lintel
- **Commons Tower** — the final landmark — rendered as a tall slender tower with stepped base

Do not add new islands without confirming the name comes from the real BHI map.

---

## Discovery System

- State is stored in `localStorage` under key `"visited-nodes"`
- Map unlock is stored under `"found-map"`
- `lib/discovery.ts` is the single source of truth — do not read/write localStorage directly elsewhere
- `lib/graph.ts` defines node IDs, routes, unlock chains, and world positions

### Graph Topology

```
happy-fathers-day  (entry page — not a sailboat island)
├── ferry-dock       ─┐
├── old-baldy         ├─ all three must be visited → unlocks shoals-club
└── old-boat-house   ─┘
                           ↓
                      shoals-club   (requires all 3 above)
                           ↓
                      commons-tower (requires shoals-club)
```

`happy-fathers-day` is the `/happy-fathers-day` page — it exists in the graph to own the initial `unlocks` list but is filtered out of `ISLAND_NODES` and never rendered in the 3D scene.

`shoals-club` is a convergence node — it has a `requires` list of all three preceding islands. `commons-tower` is the terminal node (`unlocks: []`).

The secret map at `/` unlocks once `ferry-dock`, `old-baldy`, `old-boat-house`, and `shoals-club` have all been visited (defined by `MAP_UNLOCK_REQUIRES` in `graph.ts`).

---

## Photos

- All photos live in `public/photos/`
- Exactly **4 photos per island**, no repeats across islands
- Current distribution (do not change without instruction):

| Island | Photos |
|---|---|
| Ferry Dock | DSC_0285.jpeg, IMG_0086.JPG, IMG_0542.jpeg, IMG_0770.JPG |
| Old Baldy | IMG_1244.jpeg, IMG_1472.jpeg, IMG_1610.JPG, IMG_1742.JPG |
| Old Boat House | IMG_2515.jpeg, IMG_5051.JPG, IMG_5191.JPG, IMG_6531.jpeg |
| Shoals Club | IMG_6970.JPG, IMG_7173.JPG, IMG_8268.JPG, IMG_8269.JPG |
| Commons Tower | IMG_9510.jpeg, IMG_9593.jpeg, Picture 055.JPG, Resized_1000000069.jpg |

---

## 3D Scene Rules

**Lighting:** High ambient (`intensity={2.0}`), moderate directional (`intensity={1.2}`). Keep lighting flat and even — avoid dramatic shadows (not photorealistic).

**Sky:** Low turbidity (`turbidity={2}`), high rayleigh (`rayleigh={2}`) for a bright clear day.

**Ocean:** Flat roughness=1, no metalness, pastel blue `#7dd4e8`, gentle sine-wave vertex animation.

**Islands:** Geometric stone monuments only. No organic shapes. Each island has a unique architectural silhouette (see Island Naming Convention above). Colours: warm sand base, muted stone monuments.

**No text labels** on 3D objects. Navigation is discovered through exploration.

**Discovery prompt:** A silent white pulsing dot (`animate-pulse`) appears near the island when the boat is within detection radius and the island is unlocked. No text, no labelling.

---

## Controls

| Input | Action |
|---|---|
| W / ↑ | Sail forward |
| S / ↓ | Reverse |
| A / ← | Turn left |
| D / → | Turn right |
| Space | Enter nearest unlocked island |
| Mouse move | Tilt camera (up = look toward horizon, down = look at water) |
| Click island / white dot | Enter island |

---

## UI Components

**Modal (intro card):**
- Sharp rectangular card — `rounded-none` always
- Thin `2px` `#002147` accent bar at top
- Narrow width (~232px), generous vertical padding
- Ghost/outline button that fills solid `#002147` on hover (500ms transition)
- Backdrop: near-invisible `backdrop-blur-[2px]` — ocean stays visible behind

**PhotoPage:**
- Background: `#e8eff7`
- Polaroid style: `bg-white`, `padding: 12px 12px 52px 12px` (thick bottom border), slight random rotation, `hover:rotate-0 hover:scale-105`
- Lightbox: clicking a polaroid opens full photo on `bg-black/90` overlay; click anywhere to close; no X button; Escape also closes
- Island name as micro-label: `text-[10px] font-mono tracking-[0.6em] uppercase text-[#00356b]/50`
- Nav: `←` and `○` only — no other chrome

**Map page (`/`):**
- SVG graph with square nodes (not circles)
- Thin `0.75px` lines between nodes
- Visited nodes: filled `#002147` square, label at `60%` opacity
- Unvisited nodes: empty stroke at `20%` opacity, label at `18%` opacity
- No node list below the graph — the SVG is the entire UI
- Clicking a visited square navigates to that route

**Help button:**
- Small white circle in bottom-right of ocean scene, visible after intro closes
- Shows mono tooltip with three lines: `W A S D — sail`, `Space — enter island`, `Sail close to discover`
