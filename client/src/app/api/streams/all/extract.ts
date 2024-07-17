import fs from "fs";
import cron from "node-cron";

import { StreamResponse } from "@/music/_/types";

export const filePath = "./src/app/api/streams/all/stream-info.json";

const removePreviousData = () => {
  const isFileExist = fs.existsSync(filePath);
  if (isFileExist) {
    fs.unlinkSync(filePath);
    console.log("File deleted successfully.");
  }
  console.log("File does not exist.");
};

export async function extractStreamInfo() {
  removePreviousData();
  const url = `${process.env.MUSIC_SERVICE_CONTAINER}/chill/extract`;
  const response = await fetch(url, {
    headers: { "Content-Type": "application/json" },
  });

  const data = (await response.json()) as StreamResponse;

  try {
    fs.writeFileSync(filePath, JSON.stringify(data));
  } catch (error) {
    console.error("Error writing to JSON file:", error);
  }
  return data;
}

cron.schedule("0 0 * * *", async () => {
  try {
    await extractStreamInfo();
    console.log("Information updated and stored successfully.");
  } catch (error) {
    console.error("Error updating and storing information:", error);
  }
});
