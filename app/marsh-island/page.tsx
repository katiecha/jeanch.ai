"use client";

import { useEffect } from "react";
import { PhotoPage } from "@/components/PhotoPage";
import { markVisited } from "@/lib/discovery";

const PHOTOS = [
  "/photos/club.jpeg",
  "/photos/IMG_0959.JPEG",
  "/photos/IMG_2268.jpeg",
];

export default function MarshIslandPage() {
  useEffect(() => { markVisited("marsh-island"); }, []);
  return <PhotoPage title="Marsh" photos={PHOTOS} />;
}
