import { type NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const url = searchParams.get("url");
  const res = await fetch(`${process.env.MUSIC_SERVICE_CONTAINER}/stream?url=${url}`, {
    headers: { "Content-Type": "application/json" },
  });

  type Data = {
    message: string;
    audio_url: string;
  };

  const data: Data = await res.json();

  const payload = {
    type: "streams",
  };

  return NextResponse.json(
    { stream: data, message: "success", payload },
    { status: 307, headers: { location: data.audio_url } },
  );
}
