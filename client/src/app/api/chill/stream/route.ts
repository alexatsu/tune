import { NextResponse } from "next/server";

import { extractResult, extractStreamInfo } from "./extract";

export async function GET() {
  if (!extractResult) {
    await extractStreamInfo();
  }
  return NextResponse.json({ message: "success", streams: extractResult }, { status: 307 });
}
