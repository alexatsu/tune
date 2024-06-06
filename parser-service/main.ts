import puppeteer from "puppeteer";

const parseTopSongs = async () => {
  const browser = await puppeteer.launch({
    headless: true,
    defaultViewport: null,
  });

  const page = await browser.newPage();
  await page.goto("https://www.chosic.com/genre-chart/pop/tracks/", {
    waitUntil: "domcontentloaded",
  });

  type Results = { title: string | null; artist: string | null }[];
  const results: Results = [];

  const charts = await page.$$(".song-div");

  for (const chart of charts) {
    const getTrackListItem = await chart.$(".track-list-item");
    const getTrackListItemInfoText = await getTrackListItem?.$(".track-list-item-info-text");
    const getAChildren = await getTrackListItemInfoText?.$$("a");
    const [title, artist] = await Promise.all(
      getAChildren?.map((a) => a.evaluate((el) => el.textContent)) || []
    );

    results.push({ title, artist });
  }

  await browser.close();
  // console.log(results);
  // console.log(results.length, "results found");

  return results;
};

parseTopSongs();

const payload = await parseTopSongs();
// console.log(payload);

await fetch("http://localhost:8010/charts/top", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ payload, chartType: "top-pop" }),
});
