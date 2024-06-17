import { Hono } from "hono";
import { prettyJSON } from "hono/pretty-json";
import { serve } from "@hono/node-server";
import { routes } from "@/routes";
 
import "@/cron/parseCharts";

const app = new Hono();
const { chartsRoutes } = routes;

app.use(prettyJSON());
// app.get("/", (c) => c.json({ message: "Hello, World!" }));

app.route("/", chartsRoutes);

serve({
  fetch: app.fetch,
  port: 8020,
});
