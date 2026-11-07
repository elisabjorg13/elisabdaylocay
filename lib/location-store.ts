import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";
import { get, put } from "@vercel/blob";
import { parsePoint } from "@/lib/geo";

const filePath = path.join(process.cwd(), "data", "location.json");
const blobPath = "location.json";

export type SavedLocation = {
  lat: number;
  lng: number;
  accuracy: number;
  updatedAt: string;
};

export class LocationStoreError extends Error {}

function asPoint(value: unknown): SavedLocation | null {
  const point = parsePoint(value);
  if (!point || !value || typeof value !== "object") return null;
  const updatedAt = (value as { updatedAt?: unknown }).updatedAt;
  if (typeof updatedAt !== "string") return null;
  return { ...point, accuracy: Math.round(point.accuracy), updatedAt };
}

function parseHistory(text: string): SavedLocation[] {
  const parsed: unknown = JSON.parse(text);
  if (parsed && typeof parsed === "object" && "points" in parsed && Array.isArray(parsed.points)) {
    return parsed.points.flatMap((item) => {
      const point = asPoint(item);
      return point ? [point] : [];
    });
  }
  const single = asPoint(parsed);
  return single ? [single] : [];
}

function usesBlob() {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN || process.env.BLOB_STORE_ID);
}

async function readBlob(): Promise<SavedLocation[]> {
  const result = await get(blobPath, { access: "private", useCache: false });
  if (!result || result.statusCode !== 200) return [];
  return parseHistory(await new Response(result.stream).text());
}

async function writeBlob(points: SavedLocation[]) {
  await put(blobPath, JSON.stringify({ points }), {
    access: "private",
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: "application/json",
    cacheControlMaxAge: 60,
  });
}

async function readFileHistory(): Promise<SavedLocation[]> {
  return parseHistory(await readFile(filePath, "utf8"));
}

async function writeFileHistory(points: SavedLocation[]) {
  await mkdir(path.dirname(filePath), { recursive: true });
  await writeFile(filePath, JSON.stringify({ points }));
}

export async function readHistory(): Promise<SavedLocation[]> {
  try {
    return usesBlob() ? await readBlob() : await readFileHistory();
  } catch {
    return [];
  }
}

async function writeHistory(points: SavedLocation[]) {
  if (usesBlob()) {
    try {
      await writeBlob(points);
    } catch {
      throw new LocationStoreError("Could not save the location.");
    }
    return;
  }
  if (process.env.VERCEL) {
    throw new LocationStoreError(
      "Saving needs a Vercel Blob store. In the Vercel project, open Storage, create a Blob store, connect it, and redeploy.",
    );
  }
  try {
    await writeFileHistory(points);
  } catch (error) {
    const code = error && typeof error === "object" && "code" in error ? String(error.code) : "";
    if (code === "EROFS" || code === "EPERM" || code === "EACCES") {
      throw new LocationStoreError(
        "Saving needs a Vercel Blob store. In the Vercel project, open Storage, create a Blob store, connect it, and redeploy.",
      );
    }
    throw new LocationStoreError("Could not save the location.");
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
  await writeHistory(history);
  return saved;
}

export async function clearHistory() {
  await writeHistory([]);
}
