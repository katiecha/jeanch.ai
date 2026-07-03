# jeanch.ai

A Father's Day gift for Captain Chai — an interactive sailing world built with **Next.js 15 App Router** and **React Three Fiber**. Sail a boat around Bald Head Island to discover photo galleries at each landmark.

**Tech highlights:**
- **GLSL ocean shader** — custom vertex/fragment shader with multi-frequency wave geometry, foam bands, and 0.72 alpha transparency; wave math is mirrored in JS so the boat rides the surface correctly
- **Apparent-wind sail simulation** — sails rotate and ripple based on the vector difference between true wind and boat velocity, with `BufferGeometry` vertex mutation per frame for cloth billowing
- **Hand-modeled landmarks** — Old Baldy lighthouse, the Ranger ferry, a beach house, golf cart, and marsh scene all built from Three.js primitives with procedural `CanvasTexture` weathering
- **Animated fish** — `FishSchool` component with per-fish circular orbits at varying depths and speeds, shared across sailing and gallery scenes
- **`@react-three/postprocessing`** — Bloom, ChromaticAberration, and Vignette via `EffectComposer`
- **`@react-three/drei` Html overlays** — island name labels and proximity prompts anchored in 3D space
- **Graph-based discovery** — node graph in `lib/graph.ts`, visited state in `localStorage`, rendered as an SVG chart with visited/unvisited distinction
