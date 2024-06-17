import { Hono } from "hono";
import { retrieveProcessedCharts, sendToBackup, getCharts } from "./controllers";

const chartsRoutes = new Hono().basePath("/charts");

chartsRoutes.post("/retrieve-processed", retrieveProcessedCharts);
chartsRoutes.get("/send-charts-to-backup", sendToBackup);
chartsRoutes.get("/get-charts", getCharts);

export { chartsRoutes };
