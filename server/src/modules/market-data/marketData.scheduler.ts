import cron from "node-cron";
import { error } from "../../libs/logger.js";
import {
  marketDataCollectorCollectBySource,
  marketDataCollectors,
  type MarketDataCollector,
} from "./marketData.collector.js";

const runningSources = new Set<string>();

const runCollector = async (collector: MarketDataCollector): Promise<void> => {
  // Prevent overlapping runs for the same external source.
  if (runningSources.has(collector.source)) {
    return;
  }

  runningSources.add(collector.source);

  await marketDataCollectorCollectBySource(collector.source).finally(() => {
    runningSources.delete(collector.source);
  });
};

const scheduleCollector = (collector: MarketDataCollector) => {
  if (!cron.validate(collector.cronExpression)) {
    error(
      "scheduleCollector",
      `Invalid cron expression: ${collector.source} (${collector.cronExpression})`,
    );

    // Keep scheduler startup resilient; invalid collectors simply do not run.
    return () => undefined;
  }

  const task = cron.schedule(collector.cronExpression, () => runCollector(collector));

  return () => task.stop();
};

export const startMarketDataScheduler = () => {
  const stopTasks = marketDataCollectors.map(scheduleCollector);

  // Return one cleanup hook for server shutdown.
  return () => stopTasks.map((stopTask) => stopTask());
};
