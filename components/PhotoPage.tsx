"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { isMapFound } from "@/lib/discovery";

interface PhotoPageProps {
  title: string;
  photos: string[];
  fadeIn?: boolean;
}

const ROTATIONS = [
  "rotate-[1.8deg]",
  "-rotate-[1.2deg]",
  "rotate-[0.6deg]",
  "-rotate-[2.1deg]",
  "rotate-[2.4deg]",
];

export function PhotoPage({ title, photos, fadeIn = false }: PhotoPageProps) {
  const [visible, setVisible] = useState(!fadeIn);
  const [mapUnlocked, setMapUnlocked] = useState(false);
  const [lightbox, setLightbox] = useState<string | null>(null);

  useEffect(() => {
    setMapUnlocked(isMapFound());
    if (fadeIn) {
      const t = setTimeout(() => setVisible(true), 200);
      return () => clearTimeout(t);
    }
  }, [fadeIn]);

  // Close lightbox on Escape
  useEffect(() => {
    if (!lightbox) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") setLightbox(null); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [lightbox]);

  return (
    <main className="min-h-screen bg-[#e8eff7] flex flex-col">
      <nav className="flex items-center justify-between px-8 pt-8">
        <Link
          href="/happy-fathers-day"
          className="text-[#00356b]/40 hover:text-[#00356b] text-xs font-mono tracking-widest transition-colors"
        >
          ←
        </Link>
        {mapUnlocked && (
          <Link
            href="/"
            className="text-[#00356b]/40 hover:text-[#00356b] text-xs font-mono tracking-widest transition-colors"
          >
            ○
          </Link>
        )}
      </nav>

      <div
        className={`flex-1 flex flex-col items-center justify-center px-10 py-12 transition-all duration-1000 ${
          visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
      >
        <p className="text-[#00356b]/50 text-[10px] font-mono tracking-[0.6em] uppercase mb-14">
          {title}
        </p>

        <ul className="grid grid-cols-2 gap-8 p-4">
          {photos.map((src, i) => (
            <li
              key={src}
              onClick={() => setLightbox(src)}
              className={`
                bg-white cursor-pointer
                shadow-[0_6px_20px_rgba(0,53,107,0.18)]
                ${ROTATIONS[i % ROTATIONS.length]}
                hover:rotate-0 hover:scale-105
                transition-all duration-300
              `}
              style={{ padding: "12px 12px 52px 12px" }}
            >
              <div className="relative" style={{ width: 148, height: 148 }}>
                <Image
                  src={src}
                  alt={title}
                  fill
                  className="object-cover"
                  sizes="148px"
                />
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Lightbox — click anywhere to close, no X */}
      {lightbox && (
        <div
          className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 cursor-pointer"
          onClick={() => setLightbox(null)}
        >
          <Image
            src={lightbox}
            alt=""
            width={1200}
            height={900}
            className="object-contain max-h-[92vh] max-w-[92vw] w-auto h-auto"
          />
        </div>
      )}
    </main>
  );
}
