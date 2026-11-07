"use client";

import { useEffect } from "react";
import { Circle, CircleMarker, MapContainer, Marker, Polyline, TileLayer, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const LONDON: [number, number] = [51.5074, -0.1278];

const dotIcon = L.divIcon({
  className: "live-location-icon",
  html: '<span class="live-location-dot"></span>',
  iconSize: [22, 22],
  iconAnchor: [11, 11],
});

const currentIcon = L.divIcon({
  className: "live-location-icon",
  html: '<span class="live-location-dot live-location-dot-hot"></span>',
  iconSize: [42, 42],
  iconAnchor: [21, 21],
});

export type MapPoint = {
  lat: number;
  lng: number;
  accuracy: number;
  updatedAt: string;
};

function Frame({ points }: { points: MapPoint[] }) {
  const map = useMap();
  const trailKey = points.map((point) => point.updatedAt).join("|");

  useEffect(() => {
    if (points.length === 0) return;
    if (points.length === 1) {
      map.setView([points[0].lat, points[0].lng], 15);
      return;
    }
    map.fitBounds(
      points.map((point) => [point.lat, point.lng]),
      { padding: [48, 48], maxZoom: 15 },
    );
  }, [trailKey, map, points]);

  return null;
}

export default function LiveMap({
  points,
  emphasizeLatest,
}: {
  points: MapPoint[];
  emphasizeLatest: boolean;
}) {
  const latest = points.at(-1) ?? null;
  const line = points.map((point) => [point.lat, point.lng] as [number, number]);

  return (
    <MapContainer
      center={latest ? [latest.lat, latest.lng] : LONDON}
      zoom={latest ? 15 : 12}
      className="h-full w-full"
      scrollWheelZoom
      zoomControl={false}
      attributionControl
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {points.length > 0 && <Frame points={points} />}
      {line.length > 1 && (
        <Polyline positions={line} pathOptions={{ color: "#1d4ed8", weight: 4, opacity: 0.85 }} />
      )}
      {points.slice(0, -1).map((point) => (
        <CircleMarker
          key={point.updatedAt}
          center={[point.lat, point.lng]}
          radius={6}
          pathOptions={{ color: "#1d4ed8", weight: 2, fillColor: "#ffffff", fillOpacity: 1 }}
        />
      ))}
      {latest && latest.accuracy >= 1 && (
        <Circle
          center={[latest.lat, latest.lng]}
          radius={latest.accuracy}
          pathOptions={{
            color: emphasizeLatest ? "#dc2626" : "#1d4ed8",
            weight: emphasizeLatest ? 3 : 1,
            fillColor: emphasizeLatest ? "#dc2626" : "#3b82f6",
            fillOpacity: 0.12,
          }}
        />
      )}
      {latest && (
        <Marker
          key={emphasizeLatest ? "current-hot" : "current"}
          position={[latest.lat, latest.lng]}
          icon={emphasizeLatest ? currentIcon : dotIcon}
          zIndexOffset={emphasizeLatest ? 1000 : 0}
        />
      )}
    </MapContainer>
  );
}
