"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { formatAge } from "@/lib/format";

const LiveMap = dynamic(() => import("@/components/LiveMap"), {
  ssr: false,
  loading: () => <div className="h-full w-full bg-[#d9e4ea]" />,
});

type Fix = { lat: number; lng: number; accuracy: number; updatedAt: string };

function readPoints(data: unknown): Fix[] {
  if (!data || typeof data !== "object" || !("points" in data) || !Array.isArray(data.points)) return [];
  return data.points.flatMap((item) => {
    if (!item || typeof item !== "object") return [];
    const point = item as Record<string, unknown>;
    if (typeof point.lat !== "number" || typeof point.lng !== "number" || typeof point.updatedAt !== "string") {
      return [];
    }
    return [
      {
        lat: point.lat,
        lng: point.lng,
        accuracy: typeof point.accuracy === "number" ? point.accuracy : 0,
        updatedAt: point.updatedAt,
      },
    ];
  });
}

export default function LocationMap() {
  const [points, setPoints] = useState<Fix[]>([]);
  const [now, setNow] = useState(() => Date.now());
  const [emphasizeLatest, setEmphasizeLatest] = useState(false);

  useEffect(() => {
    const clock = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(clock);
  }, []);

  useEffect(() => {
    let stopped = false;
    let timer = 0;

    const load = async () => {
      try {
        const response = await fetch("/api/location", { cache: "no-store" });
        const data: unknown = await response.json();
        if (!stopped) {
          const next = readPoints(data);
          setPoints((current) => {
            if (
              current.length === next.length &&
              current.every((point, index) => point.updatedAt === next[index]?.updatedAt)
            ) {
              return current;
            }
            return next;
          });
        }
      } catch {
        // Keep the last dot on screen if a refresh fails.
      }
      if (!stopped) timer = window.setTimeout(() => void load(), 5000);
    };

    void load();
    return () => {
      stopped = true;
      window.clearTimeout(timer);
    };
  }, []);

  const latest = points.at(-1) ?? null;
  const age = latest ? now - new Date(latest.updatedAt).getTime() : null;
  const placeLabel = points.length === 1 ? "1 place" : `${points.length} places`;

  return (
    <main className="flex h-dvh flex-col">
      <header
        className="bg-white px-5 pb-4 pt-[max(1.25rem,env(safe-area-inset-top))]"
        style={{ fontFamily: '"Times New Roman", Times, serif' }}
      >
        <h1 className="text-4xl leading-tight sm:text-5xl">
          Where is Elisa? come find me{" "}
          <button
            type="button"
            onClick={() => setEmphasizeLatest((on) => !on)}
            className="cursor-pointer font-[inherit] text-[length:inherit] leading-[inherit] text-[#ffb6c1]"
            aria-pressed={emphasizeLatest}
          >
            HERE
          </button>
        </h1>
        <p className="mt-3 text-2xl leading-snug">
          {latest && age != null && Number.isFinite(age)
            ? `Updated ${formatAge(age)} · ${placeLabel}`
            : "No location yet"}
        </p>
      </header>
      <div className="relative min-h-0 flex-1">
        <LiveMap points={points} emphasizeLatest={emphasizeLatest} />
      </div>
    </main>
  );
}
