import { ChillStreamResponse } from "@/shared/utils/types";

const cron = require("node-cron");

export let extractResult: null | ChillStreamResponse = null;

export async function extractStreamInfo() {
  const response = await fetch(`${process.env.MUSIC_SERVICE_CONTAINER}/chill/extract`, {
    headers: { "Content-Type": "application/json" },
  });

  const data = (await response.json()) as ChillStreamResponse;

  extractResult = data;
}

cron.schedule("0 0 * * *", async () => {
  try {
    await extractStreamInfo();
    console.log("Information updated and stored successfully.");
  } catch (error) {
    console.error("Error updating and storing information:", error);
  }
});
