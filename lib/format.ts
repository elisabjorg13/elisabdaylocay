export function formatAge(ms: number) {
  const seconds = Math.max(0, Math.round(ms / 1000));
  if (seconds < 5) return "just now";
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  return `${hours}h ago`;
}

export function formatAccuracy(meters: number) {
  const rounded = Math.max(1, Math.round(meters));
  return `±${rounded} m`;
}

export function formatCoordinate(value: number) {
  return value.toFixed(5);
}
