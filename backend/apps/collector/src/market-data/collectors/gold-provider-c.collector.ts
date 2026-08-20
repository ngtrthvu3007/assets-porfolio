import { Injectable, Logger } from '@nestjs/common';
import { ASSET_TYPES } from '@shared/types/assets';
import type { MarketDataCollectionResult } from '@shared/types/market-data';
import axios from 'axios';
import type { GoldProviderCApiResponse } from '../types/gold-provider-c-api.type';
import type { MarketDataCollector } from '../types/market-data-collector.type';
import type { GoldProviderCSourceConfig } from './gold-provider-c-source.config';

const CHI_TO_LUONG_MULTIPLIER = 10;

const PRODUCT_NAME_TO_ASSET: Record<string, { name: string; symbol: string }> =
  {
    TS99: { name: 'Kim Nga 99', symbol: 'KN99' },
    TS999: { name: 'Kim Nga 999', symbol: 'KN999' },
    TS9999: { name: 'Kim Nga 9999', symbol: 'KN9999' },
  };

@Injectable()
export class GoldProviderCCollector implements MarketDataCollector {
  private readonly logger = new Logger(GoldProviderCCollector.name);

  public constructor(private readonly config: GoldProviderCSourceConfig) {}

  public get cronExpression(): string {
    return this.config.cronExpression;
  }

  public get source(): string {
    return this.config.source;
  }

  public async collect(): Promise<MarketDataCollectionResult> {
    const response = await axios.get<GoldProviderCApiResponse>(
      this.config.baseUrl,
    );

    if (!response.data.success) {
      throw new Error(`${this.source} returned unsuccessful response`);
    }

    const days = [...response.data.data.days].sort((a, b) =>
      a.date.localeCompare(b.date),
    );
    const latestDay = days.at(-1);
    const previousDay = days.at(-2);

    if (!latestDay) {
      throw new Error(`${this.source} returned no history data`);
    }

    const previousProductsByName = new Map(
      (previousDay?.products ?? []).map((product) => [product.name, product]),
    );
    // Kim Nga only returns a date (no time-of-day), so using it directly
    // would render every quote at 00:00:00 — use the collection time instead.
    const sourceUpdatedAt = new Date();
    const trackedProducts = latestDay.products.filter(
      (product) => product.name in PRODUCT_NAME_TO_ASSET,
    );

    this.logger.debug(
      `Latest day ${latestDay.date} (${latestDay.status}), keeping ${trackedProducts.length} products: ${trackedProducts
        .map((product) => product.name)
        .join(', ')}`,
    );

    return {
      collectedAt: sourceUpdatedAt,
      quotes: trackedProducts.map((product) => {
        const previousProduct = previousProductsByName.get(product.name);
        const asset = PRODUCT_NAME_TO_ASSET[product.name];

        return {
          asset: {
            name: asset.name,
            symbol: asset.symbol,
            type: ASSET_TYPES.gold,
          },
          buyChange: previousProduct
            ? (product.buy.close - previousProduct.buy.close) *
              CHI_TO_LUONG_MULTIPLIER
            : null,
          buyPrice: product.buy.close * CHI_TO_LUONG_MULTIPLIER,
          sellChange: previousProduct
            ? (product.sell.close - previousProduct.sell.close) *
              CHI_TO_LUONG_MULTIPLIER
            : null,
          sellPrice: product.sell.close * CHI_TO_LUONG_MULTIPLIER,
          source: this.source,
          sourceUpdatedAt,
        };
      }),
      source: this.source,
      sourcePayload: latestDay,
    };
  }
}
