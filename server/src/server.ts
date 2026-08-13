import { createApp } from "./app.js";
import { envConfig } from "./config/env.js";
import { prisma } from "./libs/prisma.js";
import { startMarketDataScheduler } from "./modules/market-data/marketData.scheduler.js";

const app = createApp();
const stopMarketDataScheduler = startMarketDataScheduler();

const server = app.listen(envConfig.port);

const shutdown = async (): Promise<void> => {
  stopMarketDataScheduler();

  server.close(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
