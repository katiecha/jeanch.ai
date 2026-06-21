"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { isMapFound } from "@/lib/discovery";

interface PageShellProps {
  title: string;
  subtitle?: string;
  accentColor: string;
  children: React.ReactNode;
  backLabel?: string;
}

export function PageShell({ title, subtitle, accentColor, children, backLabel }: PageShellProps) {
  const [mapUnlocked, setMapUnlocked] = useState(false);

  useEffect(() => {
    setMapUnlocked(isMapFound());
  }, []);

  return (
    <div className="min-h-screen bg-[#050f1a] text-white">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 bg-[#050f1a]/80 backdrop-blur-sm border-b border-white/10">
        <Link
          href="/happy-fathers-day"
          className="text-white/60 hover:text-white text-sm transition-colors font-mono"
        >
          &larr; {backLabel ?? "Back to sea"}
        </Link>
        {mapUnlocked && (
          <Link
            href="/"
            className="text-white/60 hover:text-amber-400 text-sm transition-colors font-mono"
          >
            View map
          </Link>
        )}
      </nav>

      {/* Hero */}
      <header className="pt-28 pb-12 px-6 text-center">
        <div
          className="inline-block w-1 h-12 mb-6 rounded"
          style={{ background: accentColor }}
        />
        <h1 className="text-4xl md:text-5xl font-bold mb-3">{title}</h1>
        {subtitle && <p className="text-white/50 text-lg font-light italic">{subtitle}</p>}
      </header>

      {/* Content */}
      <main className="max-w-3xl mx-auto px-6 pb-24">{children}</main>
    </div>
  );
}
