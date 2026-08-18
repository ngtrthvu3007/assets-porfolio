import { Module } from '@nestjs/common';
import { MarketDataApiCollector } from './collectors/market-data-api.collector';
import { loadMarketDataApiSourceConfig } from './collectors/market-data-api-source.config';
import { MARKET_DATA_COLLECTORS } from './market-data.tokens';
import { MarketDataRepository } from './market-data.repository';
import { MarketDataSchedulerService } from './market-data-scheduler.service';
import { MarketDataService } from './market-data.service';
import type { MarketDataCollector } from './types/market-data-collector.type';

const MARKET_DATA_API_SOURCE_ENV_PREFIXES = ['GOLD_SOURCE_1'];

@Module({
  providers: [
    MarketDataRepository,
    MarketDataSchedulerService,
    MarketDataService,
    {
      provide: MARKET_DATA_COLLECTORS,
      useFactory: (): MarketDataCollector[] =>
        MARKET_DATA_API_SOURCE_ENV_PREFIXES.map(
          (envPrefix) =>
            new MarketDataApiCollector(
              loadMarketDataApiSourceConfig(envPrefix),
            ),
        ),
    },
  ],
})
export class MarketDataModule {}
