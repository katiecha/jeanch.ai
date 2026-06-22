"use client";

import { useEffect } from "react";
import { PhotoPage } from "@/components/PhotoPage";
import { markVisited } from "@/lib/discovery";

const PHOTOS = [
  "/photos/IMG_5051.JPG",
  "/photos/IMG_5191.JPG",
  "/photos/IMG_8270.JPG",
];

export default function OldBoatHouse() {
  useEffect(() => { markVisited("old-boat-house"); }, []);
  return <PhotoPage title="Aunty Karon's House" photos={PHOTOS} />;
}
