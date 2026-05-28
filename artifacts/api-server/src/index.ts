import app from "./app";
import { logger } from "./lib/logger";
import SerpApi from "google-search-results-nodejs";
const rawPort = process.env["PORT"];

if (!rawPort) {
  throw new Error(
    "PORT environment variable is required but was not provided.",
  );
}

const port = Number(rawPort);

if (Number.isNaN(port) || port <= 0) {
  throw new Error(`Invalid PORT value: "${rawPort}"`);
}

app.listen(port, (err) => {
  if (err) {
    logger.error({ err }, "Error listening on port");
    process.exit(1);
  }

  logger.info({ port }, "Server listening");
});
const search = new SerpApi.GoogleSearch(process.env.SERPAPI_KEY);

async function findWorkingLink(title: string) {
  return new Promise((resolve) => {
    search.json(
      {
        q: `${title} registration`,
        hl: "en",
        gl: "in",
      },
      (data: any) => {
        const firstResult = data.organic_results?.[0]?.link;
        resolve(firstResult || null);
      },
    );
  });
}

async function isBroken(url: string) {
  try {
    const res = await fetch(url);
    return !res.ok;
  } catch {
    return true;
  }
}
