import cron from "node-cron";
import * as cheerio from "cheerio";
import axios from "axios";

type Chart = { title: string | null; artist: string | null };

const runParseJob = async () => {
  const result: Record<string, Chart[]> = {};

  const parseTopSongsByCategory = async (category: string) => {
    const url = `https://www.chosic.com/genre-chart/${category}/tracks/`;
    try {
      const response = (await axios.get(url)) as { data: string };
      const html = response.data as string;

      const $ = cheerio.load(html);
      const store: Chart[] = [];

      const charts = $(".song-div");
      console.log("charts", charts.length);
      charts.each((i, chart) => {
        const getTrackListItem = $(chart).find(".track-list-item");
        const getTrackListItemInfoText = $(getTrackListItem).find(".track-list-item-info-text");
        const getAChildren = $(getTrackListItemInfoText).find("a");
        const title = $(getAChildren[0]).text();
        const artist = $(getAChildren[1]).text();
        store.push({ title, artist });
      });

      return { [category]: store };
    } catch (error) {
      console.error("Error parsing top songs by category:", error);
    }
  };

  const topsUrl = [
    "pop",
    "rock",
    "electronic",
    "hip-hop",
    "rb",
    "latin",
    "metal",
    "classical",
    "ambient",
    "trap",
    "rap",
  ];

  for (const url of topsUrl) {
    const charts = await parseTopSongsByCategory(url);
    if (charts) {
      result[url] = charts[url];
    }
  }

  const sendParsedDataToChartBuilder = async () => {
    const prodContainer = process.env.CHARTS_SERVICE_CONTAINER;
    const localContainer = "http://charts-service:8010";
    const isProduction = process.env.NODE_ENV === "production";
    const container = isProduction ? prodContainer : localContainer;

    const response = await fetch(container + "/charts/top", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ payload: result }),
    });

    const data = await response.json();

    console.log(data);
  };

  sendParsedDataToChartBuilder();
};

if (process.env.NODE_ENV === "production") {
  runParseJob();
}

cron.schedule("0 0 * * 0", runParseJob);
