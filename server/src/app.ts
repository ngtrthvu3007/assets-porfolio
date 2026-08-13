import cors from "cors";
import express from "express";
import helmet from "helmet";
import { envConfig } from "./config/env.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { healthRouter } from "./routes/health.route.js";
import { marketDataRouter } from "./routes/marketData.route.js";
import { pricesRouter } from "./routes/prices.route.js";

export const createApp = (): express.Express => {
  const app = express();

  app.use(helmet());
  app.use(cors({ origin: envConfig.clientOrigin }));
  app.use(express.json());

  app.use("/api/market-data", marketDataRouter);
  app.use("/api", pricesRouter);
  app.use("/health", healthRouter);

  app.use(errorHandler.notFound);
  app.use(errorHandler.handle);

  return app;
};
