import fs from "fs";
import type { Context } from "hono";

const sendToBackup = async (c: Context) => {
  const path = "./src/data/top-charts.json";
  const file = fs.readFileSync(path, "utf8");
  const parse = JSON.parse(file);

  return c.json({ message: "backup!", file: parse });
};

export { sendToBackup };
