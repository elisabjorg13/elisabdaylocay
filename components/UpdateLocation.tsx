"use client";

import { useState } from "react";
import Link from "next/link";
import { formatAccuracy, formatCoordinate } from "@/lib/format";

type Fix = { lat: number; lng: number; accuracy: number; updatedAt: string };

function geoMessage(error: GeolocationPositionError) {
  if (error.code === error.PERMISSION_DENIED) {
    return "Location permission is blocked. Allow location for this site in Safari, then try again.";
  }
  if (error.code === error.TIMEOUT) return "GPS timed out. Try again.";
  return "This phone could not provide a location.";
}

export default function UpdateLocation() {
  const [fix, setFix] = useState<Fix | null>(null);
  const [status, setStatus] = useState("Press the button to save where you are.");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function clearLoc() {
    if (!window.confirm("Remove every saved place and start again?")) return;
    setBusy(true);
    setError(null);
    try {
      const response = await fetch("/api/location", { method: "DELETE" });
      if (!response.ok) {
        setError("Could not clear the old places.");
        return;
      }
      setFix(null);
      setStatus("Cleared. The map is empty until you update again.");
    } catch {
      setError("Could not reach the server.");
    } finally {
      setBusy(false);
    }
  }

  function update() {
    setError(null);
    if (!window.isSecureContext) {
      setError("Location needs HTTPS. On a phone, open the secure address for this site.");
      return;
    }
    if (!navigator.geolocation) {
      setError("This browser cannot read GPS location.");
      return;
    }

    setBusy(true);
    setStatus("Getting your location…");
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const body = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          accuracy: position.coords.accuracy,
        };
        try {
          const response = await fetch("/api/location", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
          });
          const data: unknown = await response.json();
          if (!response.ok || !data || typeof data !== "object") {
            setError("Could not save the location.");
            setStatus("Press the button to try again.");
            return;
          }
          const saved = data as Fix;
          setFix(saved);
          setStatus("Saved. The map now shows this spot.");
        } catch {
          setError("Could not reach the server.");
          setStatus("Press the button to try again.");
        } finally {
          setBusy(false);
        }
      },
      (geoError) => {
        setBusy(false);
        setError(geoMessage(geoError));
        setStatus("Press the button to try again.");
      },
      { enableHighAccuracy: true, maximumAge: 0, timeout: 20000 },
    );
  }

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col px-4 py-8">
      <p className="text-sm text-[#6b6560]">Just for you</p>
      <h1 className="mt-1 text-3xl font-semibold tracking-tight">Update location</h1>
      <p className="mt-2 text-[15px] leading-6 text-[#4c463f]">
        Each press adds a stop. The main page keeps the older ones and draws a line between them.
      </p>
      <button
        type="button"
        onClick={update}
        disabled={busy}
        className="mt-8 flex h-14 w-full items-center justify-center rounded-2xl bg-[#0c6b4d] text-base font-medium text-white disabled:opacity-50"
      >
        {busy ? "Updating…" : "Update my location"}
      </button>
      <button
        type="button"
        onClick={() => void clearLoc()}
        disabled={busy}
        className="mt-3 flex h-14 w-full items-center justify-center rounded-2xl bg-white text-base font-medium ring-1 ring-[#e4dfd6] disabled:opacity-50"
      >
        clearloc
      </button>
      <p className="mt-4 text-sm leading-5 text-[#4c463f]">{status}</p>
      {error && <p className="mt-2 text-sm leading-5 text-[#a33b32]">{error}</p>}
      {fix && (
        <dl className="mt-6 grid grid-cols-2 gap-3">
          <div className="rounded-2xl bg-white px-3 py-3 ring-1 ring-[#e4dfd6]">
            <dt className="text-xs text-[#6b6560]">Latitude</dt>
            <dd className="mt-1 font-mono text-sm">{formatCoordinate(fix.lat)}</dd>
          </div>
          <div className="rounded-2xl bg-white px-3 py-3 ring-1 ring-[#e4dfd6]">
            <dt className="text-xs text-[#6b6560]">Longitude</dt>
            <dd className="mt-1 font-mono text-sm">{formatCoordinate(fix.lng)}</dd>
          </div>
          <div className="col-span-2 rounded-2xl bg-white px-3 py-3 ring-1 ring-[#e4dfd6]">
            <dt className="text-xs text-[#6b6560]">Accuracy</dt>
            <dd className="mt-1 font-mono text-sm">{formatAccuracy(fix.accuracy)}</dd>
          </div>
        </dl>
      )}
      <Link href="/" className="mt-8 text-sm text-[#0c6b4d] underline">
        See the map
      </Link>
      <p className="mt-8 text-sm leading-5 text-[#6b6560]">
        Safari only shares location while this page is open and the phone is unlocked. It does not keep
        tracking after you leave.
      </p>
    </main>
  );
}
