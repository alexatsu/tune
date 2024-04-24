import { NextResponse } from "next/server";
import fs from "fs";
import { extractStreamInfo, filePath } from "./extract";

const readFromJson = async () => {
  try {
    const data = fs.readFileSync(filePath, "utf8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading from JSON file:", error);
  }
};

export async function GET() {
  if (!fs.existsSync(filePath)) {
    await extractStreamInfo();
    const streams = await readFromJson();
    return NextResponse.json({ message: "success", streams }, { status: 307 });
  }

  const streams = await readFromJson();
  return NextResponse.json({ message: "success", streams }, { status: 307 });
}
