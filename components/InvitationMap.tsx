"use client";

import { useEffect } from "react";
import { MapContainer, Marker, Polyline, Popup, TileLayer, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

export type JourneyStop = {
  name: string;
  time: string;
  lat: number;
  lng: number;
  href: string;
};

function pinIcon(label: string) {
  return L.divIcon({
    className: "live-location-icon",
    html: `<span class="invite-pin">${label}</span>`,
    iconSize: [34, 34],
    iconAnchor: [17, 17],
  });
}

function Frame({ stops }: { stops: JourneyStop[] }) {
  const map = useMap();
  const key = stops.map((stop) => `${stop.lat},${stop.lng}`).join("|");

  useEffect(() => {
    map.invalidateSize();
    map.fitBounds(
      stops.map((stop) => [stop.lat, stop.lng]),
      { padding: [36, 36], maxZoom: 14 },
    );
  }, [key, map, stops]);

  return null;
}

export default function InvitationMap({ stops }: { stops: JourneyStop[] }) {
  const line = stops.map((stop) => [stop.lat, stop.lng] as [number, number]);

  return (
    <MapContainer
      center={[stops[0].lat, stops[0].lng]}
      zoom={12}
      className="h-full w-full"
      scrollWheelZoom={false}
      zoomControl={false}
      attributionControl
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Frame stops={stops} />
      <Polyline positions={line} pathOptions={{ color: "#be185d", weight: 4, opacity: 0.85 }} />
      {stops.map((stop, index) => (
        <Marker key={stop.name} position={[stop.lat, stop.lng]} icon={pinIcon(String(index + 1))}>
          <Popup>
            <a href={stop.href}>{stop.time} {stop.name}</a>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
