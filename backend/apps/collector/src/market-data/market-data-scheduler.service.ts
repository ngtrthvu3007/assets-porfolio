import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';
import { MARKET_DATA_COLLECTORS } from './market-data.tokens';
import { MarketDataService } from './market-data.service';
import type { MarketDataCollector } from './types/market-data-collector.type';

@Injectable()
export class MarketDataSchedulerService implements OnModuleInit {
  private readonly logger = new Logger(MarketDataSchedulerService.name);
  private readonly runningSources = new Set<string>();

  public constructor(
    private readonly schedulerRegistry: SchedulerRegistry,
    private readonly marketDataService: MarketDataService,
    @Inject(MARKET_DATA_COLLECTORS)
    private readonly collectors: MarketDataCollector[],
  ) {}

  public onModuleInit() {
    this.collectors.forEach((collector) => {
      const job = new CronJob(collector.cronExpression, () =>
        this.collectMarketDataService(collector),
      );

      this.schedulerRegistry.addCronJob(collector.source, job);
      job.start();
    });
  }

  public async collectMarketDataService(collector: MarketDataCollector) {
    const { source } = collector;

    if (this.runningSources.has(source)) return;

    this.runningSources.add(source);

    await this.marketDataService
      .ingestMarketDataService(collector)
      .catch((error: unknown) => {
        this.logger.error(error);
      })
      .finally(() => {
        this.runningSources.delete(source);
      });
  }
}
