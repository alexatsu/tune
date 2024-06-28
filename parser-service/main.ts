import { Hono } from "hono";
import { cors } from 'hono/cors'
import { prettyJSON } from "hono/pretty-json";
import { serve } from "@hono/node-server";
import { routes } from "@/routes";
 
import "@/cron/parseCharts";

const app = new Hono();
const { chartsRoutes } = routes;

app.use(prettyJSON());
app.use(cors({ origin: "*" }));
// app.get("/", (c) => c.json({ message: "Hello, World!" }));

app.route("/", chartsRoutes);

serve({
  fetch: app.fetch,
  port: 8020,
});
