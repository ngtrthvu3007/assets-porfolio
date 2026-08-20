import { Injectable, Logger } from '@nestjs/common';
import { DEFAULT_APP_TIMEZONE } from '@shared/constants/env';
import { ASSET_TYPES } from '@shared/types/assets';
import type { MarketDataCollectionResult } from '@shared/types/market-data';
import axios from 'axios';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import type { MarketDataCollector } from '../types/market-data-collector.type';
import type { GoldProviderBApiResponse } from '../types/gold-provider-b-api.type';
import type { GoldProviderBSourceConfig } from './gold-provider-b-source.config';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(customParseFormat);

const SOURCE_DATE_TIME_FORMAT = 'DD/MM/YYYY HH:mm';

const ALLOWED_CODES = new Set(['999', '985', '980', '950']);

const CHI_TO_LUONG_MULTIPLIER = 10;

@Injectable()
export class GoldProviderBCollector implements MarketDataCollector {
  private readonly logger = new Logger(GoldProviderBCollector.name);

  public constructor(private readonly config: GoldProviderBSourceConfig) {}

  public get cronExpression(): string {
    return this.config.cronExpression;
  }

  public get source(): string {
    return this.config.source;
  }

  public async collect(): Promise<MarketDataCollectionResult> {
    const response = await axios.get<GoldProviderBApiResponse>(
      this.config.baseUrl,
    );
    const appTimezone = process.env.APP_TIMEZONE ?? DEFAULT_APP_TIMEZONE;
    const collectedAt = new Date();
    const filteredItems = response.data.filter((item) =>
      ALLOWED_CODES.has(item.code),
    );

    this.logger.debug(
      `Received ${response.data.length} items, keeping ${filteredItems.length}: ${filteredItems
        .map((item) => item.code)
        .join(', ')}`,
    );

    return {
      collectedAt,
      quotes: filteredItems.map((item) => ({
        asset: {
          name: `${this.config.assetNamePrefix} ${item.code}`,
          symbol: `${this.config.assetSymbolPrefix}${item.code}`,
          type: ASSET_TYPES.gold,
        },
        buyChange: item.buyChange * CHI_TO_LUONG_MULTIPLIER,
        buyPrice: item.buyingPrice * CHI_TO_LUONG_MULTIPLIER,
        sellChange: item.sellChange * CHI_TO_LUONG_MULTIPLIER,
        sellPrice: item.sellingPrice
          ? item.sellingPrice * CHI_TO_LUONG_MULTIPLIER
          : null,
        source: this.source,
        sourceUpdatedAt: dayjs
          .tz(item.dateTime, SOURCE_DATE_TIME_FORMAT, appTimezone)
          .toDate(),
      })),
      source: this.source,
      sourcePayload: response.data,
    };
  }
}
