import fs from "fs";
import type { Context } from "hono";
import type { Charts } from "../types";

const path = "./src/data/top-charts.json";

const deletePreviousCharts = async () => {
  if (fs.existsSync(path)) {
    fs.unlinkSync(path);
  }
};

const saveCharts = async (file: Charts) => {
  const json = JSON.stringify(file, null, 2);
  fs.writeFileSync(path, json, "utf8");
};

const retrieveProcessedCharts = async (c: Context) => {
  console.log('called')
  const body = (await c.req.json()) as Charts;
  deletePreviousCharts();
  saveCharts(body);
  return c.json({ message: "Hello!", data: body });
};

export { retrieveProcessedCharts };
