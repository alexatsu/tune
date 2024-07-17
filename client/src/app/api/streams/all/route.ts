import fs from "fs";
import { NextResponse } from "next/server";

import { extractStreamInfo, filePath } from "./extract";

export const dynamic = "force-dynamic";

const readFromJson = async () => {
  try {
    const data = fs.readFileSync(filePath, "utf8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading from JSON file:", error);
  }
};

export async function GET() {
  const streams = await readFromJson();
  const payload = { message: "success", streams, type: "streams" };
  const status = { status: 307 };

  if (!fs.existsSync(filePath)) {
    await extractStreamInfo();
    return NextResponse.json(payload, status);
  }

  return NextResponse.json(payload, status);
}
