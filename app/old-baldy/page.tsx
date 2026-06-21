"use client";

import { useEffect } from "react";
import { PhotoPage } from "@/components/PhotoPage";
import { markVisited } from "@/lib/discovery";

const PHOTOS = [
  "/photos/IMG_1244.jpeg",
  "/photos/IMG_1472.jpeg",
  "/photos/IMG_1610.JPG",
  "/photos/IMG_1742.JPG",
];

export default function OldBaldy() {
  useEffect(() => { markVisited("old-baldy"); }, []);
  return <PhotoPage title="Old Baldy" photos={PHOTOS} />;
}
