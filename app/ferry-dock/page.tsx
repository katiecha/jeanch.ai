"use client";

import { useEffect } from "react";
import { PhotoPage } from "@/components/PhotoPage";
import { markVisited } from "@/lib/discovery";

const PHOTOS = [
  "/photos/DSC_0285.jpeg",
  "/photos/IMG_0086.JPG",
  "/photos/IMG_0542.jpeg",
  "/photos/IMG_0770.JPG",
];

export default function FerryDock() {
  useEffect(() => { markVisited("ferry-dock"); }, []);
  return <PhotoPage title="Ferry Dock" photos={PHOTOS} />;
}
