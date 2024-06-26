import { Context } from "hono";
import fs from "fs";
import { Tracks } from "../types";

const readProcessedCharts = async (c: Context) => {
  const file = fs.readFileSync("./src/data/top-charts.json", "utf8");
  const parse = JSON.parse(file) as { [key: string]: Tracks[] };

  return parse;
};

const getCharts = async (c: Context) => {
  const charts = await readProcessedCharts(c);
  return c.json({ message: "Here are your charts!", data: charts });
};

export { getCharts };
