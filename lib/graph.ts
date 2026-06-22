export interface GraphNode {
  id: string;
  title: string;
  route: string;
  description: string;
  unlocks: string[];
  requires?: string[];
  worldPosition: { x: number; z: number };
  color: string;
}

export const GRAPH: Record<string, GraphNode> = {
  "happy-fathers-day": {
    id: "happy-fathers-day",
    title: "Happy Father's Day",
    route: "/happy-fathers-day",
    description: "Where it all begins.",
    unlocks: ["ferry-dock", "old-baldy", "old-boat-house", "bald-head-island-club"],
    worldPosition: { x: 0, z: 0 },
    color: "#93c5fd",
  },
  "ferry-dock": {
    id: "ferry-dock",
    title: "Ferry Dock",
    route: "/ferry-dock",
    description: "Where every visit begins.",
    unlocks: ["shoals-club"],
    worldPosition: { x: -18, z: -5 },
    color: "#86efac",
  },
  "old-baldy": {
    id: "old-baldy",
    title: "Old Baldy",
    route: "/old-baldy",
    description: "North Carolina's oldest lighthouse.",
    unlocks: ["shoals-club"],
    worldPosition: { x: 0, z: -22 },
    color: "#fde68a",
  },
  "old-boat-house": {
    id: "old-boat-house",
    title: "Old Boat House",
    route: "/old-boat-house",
    description: "Est. 1903.",
    unlocks: ["shoals-club"],
    worldPosition: { x: 18, z: -5 },
    color: "#c4b5fd",
  },
  "bald-head-island-club": {
    id: "bald-head-island-club",
    title: "Bald Head Island Club",
    route: "/bald-head-island-club",
    description: "Courts tucked into the island green.",
    unlocks: ["shoals-club"],
    worldPosition: { x: -24, z: 15 },
    color: "#bbf7d0",
  },
  "shoals-club": {
    id: "shoals-club",
    title: "Shoals Club",
    route: "/shoals-club",
    description: "Where the island gathers.",
    unlocks: ["commons-tower"],
    requires: ["ferry-dock", "old-baldy", "old-boat-house"],
    worldPosition: { x: 0, z: 20 },
    color: "#fbcfe8",
  },
  "commons-tower": {
    id: "commons-tower",
    title: "Commons Tower",
    route: "/commons-tower",
    description: "The highest point. The final view.",
    unlocks: [],
    requires: ["shoals-club"],
    worldPosition: { x: 0, z: 35 },
    color: "#bae6fd",
  },
};

export const MAP_UNLOCK_REQUIRES = ["ferry-dock", "old-baldy", "old-boat-house", "shoals-club"];

export const ISLAND_NODES = Object.values(GRAPH).filter((n) => n.id !== "happy-fathers-day");
