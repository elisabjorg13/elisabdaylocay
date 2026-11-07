export type Point = {
  lat: number;
  lng: number;
  accuracy: number;
};

export function parsePoint(value: unknown): Point | null {
  if (!value || typeof value !== "object") return null;
  const body = value as Record<string, unknown>;
  const { lat, lng, accuracy } = body;
  if (typeof lat !== "number" || typeof lng !== "number" || typeof accuracy !== "number") return null;
  if (!Number.isFinite(lat) || lat < -90 || lat > 90) return null;
  if (!Number.isFinite(lng) || lng < -180 || lng > 180) return null;
  if (!Number.isFinite(accuracy) || accuracy < 0 || accuracy > 10_000) return null;
  return { lat, lng, accuracy };
}
