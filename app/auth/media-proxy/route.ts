import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get("url");
  const res = await fetch(url??"");
  return new NextResponse(res.body, {
    headers: {
      "Content-Type": res.headers.get("Content-Type") || "video/mp4",
      "Cache-Control": "public, max-age=86400", // optional caching
    },
  });
}
