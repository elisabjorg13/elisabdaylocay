import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";
import { parsePoint } from "@/lib/geo";

const filePath = path.join(process.cwd(), "data", "location.json");

export type SavedLocation = {
  lat: number;
  lng: number;
  accuracy: number;
  updatedAt: string;
};

function asPoint(value: unknown): SavedLocation | null {
  const point = parsePoint(value);
  if (!point || !value || typeof value !== "object") return null;
  const updatedAt = (value as { updatedAt?: unknown }).updatedAt;
  if (typeof updatedAt !== "string") return null;
  return { ...point, accuracy: Math.round(point.accuracy), updatedAt };
}

export async function readHistory(): Promise<SavedLocation[]> {
  try {
    const parsed: unknown = JSON.parse(await readFile(filePath, "utf8"));
    if (parsed && typeof parsed === "object" && "points" in parsed && Array.isArray(parsed.points)) {
      return parsed.points.flatMap((item) => {
        const point = asPoint(item);
        return point ? [point] : [];
      });
    }
    const single = asPoint(parsed);
    return single ? [single] : [];
  } catch {
    return [];
  }
}

export async function addLocation(value: unknown): Promise<SavedLocation | null> {
  const saved = asPoint({
    ...(value && typeof value === "object" ? value : {}),
    updatedAt: new Date().toISOString(),
  });
  if (!saved) return null;

  const history = await readHistory();
  history.push(saved);
  await mkdir(path.dirname(filePath), { recursive: true });
  await writeFile(filePath, JSON.stringify({ points: history }));
  return saved;
}

export async function clearHistory() {
  await mkdir(path.dirname(filePath), { recursive: true });
  await writeFile(filePath, JSON.stringify({ points: [] }));
}
