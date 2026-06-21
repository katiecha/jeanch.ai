"use client";

import { useEffect } from "react";
import { PhotoPage } from "@/components/PhotoPage";
import { markVisited } from "@/lib/discovery";

const PHOTOS = [
  "/photos/IMG_2515.jpeg",
  "/photos/IMG_5051.JPG",
  "/photos/IMG_5191.JPG",
  "/photos/IMG_6531.jpeg",
];

export default function OldBoatHouse() {
  useEffect(() => { markVisited("old-boat-house"); }, []);
  return <PhotoPage title="Old Boat House" photos={PHOTOS} />;
}
