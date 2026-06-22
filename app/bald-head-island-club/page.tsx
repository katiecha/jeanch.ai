"use client";

import { useEffect } from "react";
import { PhotoPage } from "@/components/PhotoPage";
import { markVisited } from "@/lib/discovery";

const PHOTOS = [
  "/photos/club.jpeg",
];

export default function BaldHeadIslandClub() {
  useEffect(() => { markVisited("bald-head-island-club"); }, []);
  return <PhotoPage title="Bald Head Island Club" photos={PHOTOS} />;
}
