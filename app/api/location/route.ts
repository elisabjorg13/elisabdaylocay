import { NextResponse } from "next/server";
import { addLocation, clearHistory, LocationStoreError, readHistory } from "@/lib/location-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function json(data: unknown, status = 200) {
  return NextResponse.json(data, {
    status,
    headers: { "Cache-Control": "no-store" },
  });
}

export async function GET() {
  const points = await readHistory();
  return json({ points });
}

export async function POST(req: Request) {
  const text = await req.text();
  if (text.length > 2048) return json({ error: "That location could not be saved." }, 400);
  let body: unknown;
  try {
    body = JSON.parse(text);
  } catch {
    return json({ error: "That location could not be saved." }, 400);
  }
  try {
    const saved = await addLocation(body);
    if (!saved) return json({ error: "That location could not be saved." }, 400);
    return json(saved);
  } catch (error) {
    const message = error instanceof LocationStoreError ? error.message : "Could not save the location.";
    return json({ error: message }, 500);
  }
}

export async function DELETE() {
  try {
    await clearHistory();
    return json({ points: [] });
  } catch (error) {
    const message = error instanceof LocationStoreError ? error.message : "Could not clear the old places.";
    return json({ error: message }, 500);
  }
}
