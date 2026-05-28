import express, { type Express } from "express";
import cors from "cors";
import pinoHttp from "pino-http";
import router from "./routes";
import { logger } from "./lib/logger";

const app: Express = express();

app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) {
        return {
          id: req.id,
          method: req.method,
          url: req.url?.split("?")[0],
        };
      },
      res(res) {
        return {
          statusCode: res.statusCode,
        };
      },
    },
  }),
);
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", router);
app.get("/check-links", async (req, res) => {
  try {
    const response = await fetch(
      "https://spovsmnqsgcumqgmrvzk.supabase.co/rest/v1/events",
      {
        headers: {
          apikey: "sb_publishable_KDCBRagMH_4y_mcgCmQr8w_q3Fb1wSy",
          Authorization:
            "Bearer sb_publishable_KDCBRagMH_4y_mcgCmQr8w_q3Fb1wSy",
        },
      },
    );

    const events = await response.json();

    const brokenLinks = [];

    for (const event of events) {
      if (!event.link) continue;

      try {
        const test = await fetch(event.link, {
          method: "HEAD",
        });

        if (!test.ok) {
          brokenLinks.push({
            company: event.company,
            link: event.link,
          });
        }
      } catch {
        brokenLinks.push({
          company: event.company,
          link: event.link,
        });
      }
    }

    res.json({
      total: events.length,
      broken: brokenLinks,
    });
  } catch (err) {
    res.status(500).json({ error: "Failed checking links" });
  }
});
export default app;
