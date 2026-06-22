import { MAP_UNLOCK_REQUIRES } from "./graph";

const VISITED_KEY = "visited-nodes";
const MAP_FOUND_KEY = "found-map";

export function getVisited(): string[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(VISITED_KEY) ?? "[]");
  } catch {
    return [];
  }
}

export function markVisited(nodeId: string): void {
  const visited = getVisited();
  if (!visited.includes(nodeId)) {
    visited.push(nodeId);
    localStorage.setItem(VISITED_KEY, JSON.stringify(visited));
    checkMapUnlock(visited);
  }
}

export function hasVisited(nodeId: string): boolean {
  return getVisited().includes(nodeId);
}

export function isMapFound(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(MAP_FOUND_KEY) === "true";
}

function checkMapUnlock(visited: string[]): void {
  if (MAP_UNLOCK_REQUIRES.every((id) => visited.includes(id))) {
    localStorage.setItem(MAP_FOUND_KEY, "true");
  }
}

export function isNodeUnlocked(nodeId: string, requires?: string[]): boolean {
  if (!requires || requires.length === 0) return true;
  const visited = getVisited();
  return requires.every((req) => visited.includes(req));
}
