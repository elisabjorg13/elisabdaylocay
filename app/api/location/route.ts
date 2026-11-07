import { NextResponse } from "next/server";
import { addLocation, clearHistory, readHistory } from "@/lib/location-store";

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
  const saved = await addLocation(body);
  if (!saved) return json({ error: "That location could not be saved." }, 400);
  return json(saved);
}

export async function DELETE() {
  await clearHistory();
  return json({ points: [] });
}
