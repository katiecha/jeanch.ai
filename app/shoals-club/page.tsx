"use client";

import { useEffect } from "react";
import { PhotoPage } from "@/components/PhotoPage";
import { markVisited } from "@/lib/discovery";

const PHOTOS = [
  "/photos/IMG_6970.JPG",
  "/photos/IMG_7173.JPG",
  "/photos/IMG_8268.JPG",
];

export default function ShoalsClub() {
  useEffect(() => { markVisited("shoals-club"); }, []);
  return <PhotoPage title="Shoals Club" photos={PHOTOS} />;
}
