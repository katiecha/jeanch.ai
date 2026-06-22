"use client";

import { useEffect } from "react";
import { PhotoPage } from "@/components/PhotoPage";
import { markVisited } from "@/lib/discovery";

const PHOTOS = [
  "/photos/IMG_9510.jpeg",
  "/photos/IMG_9593.jpeg",
  "/photos/Picture 055.JPG",
];

export default function CommonsT() {
  useEffect(() => { markVisited("commons-tower"); }, []);
  return <PhotoPage title="Commons Tower" photos={PHOTOS} fadeIn />;
}
