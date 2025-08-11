// app/api/proxy-video/route.ts
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get("url");

  if (!url) {
    return new NextResponse("Missing url parameter", { status: 400 });
  }

  // Fetch the remote video
  const res = await fetch(url);

  if (!res.ok) {
    return new NextResponse("Failed to fetch video", { status: 502 });
  }

  // Stream response body directly back to client
  return new NextResponse(res.body, {
    headers: {
      "Content-Type": res.headers.get("Content-Type") || "video/mp4",
      "Cache-Control": "public, max-age=86400", // optional caching
    },
  });
}
