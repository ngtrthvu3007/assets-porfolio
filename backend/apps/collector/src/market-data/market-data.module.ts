import { Module } from '@nestjs/common';
import { GoldProviderACollector } from './collectors/gold-provider-a.collector';
import { loadGoldProviderASourceConfig } from './collectors/gold-provider-a-source.config';
import { GoldProviderBCollector } from './collectors/gold-provider-b.collector';
import { loadGoldProviderBSourceConfig } from './collectors/gold-provider-b-source.config';
import { GoldProviderCCollector } from './collectors/gold-provider-c.collector';
import { loadGoldProviderCSourceConfig } from './collectors/gold-provider-c-source.config';
import { MARKET_DATA_COLLECTORS } from './market-data.tokens';
import { MarketDataRepository } from './market-data.repository';
import { MarketDataSchedulerService } from './market-data-scheduler.service';
import { MarketDataService } from './market-data.service';
import type { MarketDataCollector } from './types/market-data-collector.type';

const GOLD_PROVIDER_A_ENV_PREFIXES = ['GOLD_SOURCE_1'];
const GOLD_PROVIDER_B_ENV_PREFIXES = ['GOLD_SOURCE_2'];
const GOLD_PROVIDER_C_ENV_PREFIXES = ['GOLD_SOURCE_3'];

@Module({
  providers: [
    MarketDataRepository,
    MarketDataSchedulerService,
    MarketDataService,
    {
      provide: MARKET_DATA_COLLECTORS,
      useFactory: (): MarketDataCollector[] => [
        ...GOLD_PROVIDER_A_ENV_PREFIXES.map(
          (envPrefix) =>
            new GoldProviderACollector(
              loadGoldProviderASourceConfig(envPrefix),
            ),
        ),
        ...GOLD_PROVIDER_B_ENV_PREFIXES.map(
          (envPrefix) =>
            new GoldProviderBCollector(
              loadGoldProviderBSourceConfig(envPrefix),
            ),
        ),
        ...GOLD_PROVIDER_C_ENV_PREFIXES.map(
          (envPrefix) =>
            new GoldProviderCCollector(
              loadGoldProviderCSourceConfig(envPrefix),
            ),
        ),
      ],
    },
  ],
})
export class MarketDataModule {}
