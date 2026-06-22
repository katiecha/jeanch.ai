# jeanch.ai

`jeanch.ai` is a Father's Day present web app: a small, personal Bald Head Island-inspired sailing experience that leads into photo galleries. The site is built as a lightweight Next.js app with a 3D ocean scene, discoverable islands, and simple graph-based progression.

## Overview

The main experience lives at `/happy-fathers-day`. The user sails a small boat through a stylized ocean and approaches islands to enter their photo pages. Each island is represented by a simple 3D landmark, such as a ferry dock, Old Baldy lighthouse, purple beach house, marsh, shoal, or golf cart scene.

The app is intentionally static and personal:

- no database
- no auth
- no API routes
- local discovery state stored in `localStorage`
- photos served from `public/photos/`

## 3D Scene

The 3D layer is built with:

- Three.js for geometry, materials, lights, and scene rendering
- React Three Fiber for React-based scene composition
- Drei utilities where helpful
- `@react-three/postprocessing` for subtle visual polish

Key scene files:

- `components/SailboatScene.tsx` sets up the canvas, lighting, ocean, islands, and postprocessing.
- `components/Sailboat.tsx` handles boat movement, camera follow behavior, keyboard controls, and mobile touch control events.
- `components/Ocean.tsx` animates the water mesh.
- `components/Island.tsx` renders each island's 3D object based on its graph node id.
- `components/MarshIsland.tsx` renders the marsh geometry, reeds, cattails, stream, and crane.

## Graph Architecture

The island structure is driven by `lib/graph.ts`. Each graph node defines:

- `id`
- display `title`
- route
- description
- unlock relationships
- world position in the 3D scene
- map color

`ISLAND_NODES` filters the graph down to the nodes that should appear in the sailing scene. The entry page, `happy-fathers-day`, exists in the graph as the root but is not rendered as a 3D island.

Discovery state lives in `lib/discovery.ts` and is stored in the browser under:

- `visited-nodes`
- `found-map`

The map views render the graph as simple connected nodes. The map labels currently come from `GRAPH` titles, so renaming nodes should start in `lib/graph.ts` and then be checked against page titles and route names.

## Current Island Objects

Current graph names and their 3D representations:

| Graph title | Route | 3D object |
|---|---|---|
| Ferry Dock | `/ferry-dock` | Wood dock and ferry boat |
| Old Baldy | `/old-baldy` | Old Baldy lighthouse |
| Old Boat House | `/old-boat-house` | Purple raised beach house |
| Marsh | `/marsh-island` | Marsh banks, stream, reeds, cattails, and crane |
| Shoals Club | `/shoals-club` | Sandy shoal/dune with grass |
| Commons Tower | `/commons-tower` | Purple golf cart, gold mound, and red flag |

Some graph names are placeholders and may not match the final official island mapping yet.

## Running Locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

Useful checks:

```bash
npm run lint
npm run build
```
