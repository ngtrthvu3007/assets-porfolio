import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { ASSET_TYPES } from '@shared/types/assets';
import type { MarketDataCollectionResult } from '@shared/types/market-data';
import type { MarketDataCollector } from '../types/market-data-collector.type';
import type { MarketDataApiResponse } from '../types/market-data-api.type';
import type { MarketDataApiSourceConfig } from './market-data-api-source.config';

@Injectable()
export class MarketDataApiCollector implements MarketDataCollector {
  public constructor(private readonly config: MarketDataApiSourceConfig) {}

  public get cronExpression(): string {
    return this.config.cronExpression;
  }

  public get source(): string {
    return this.config.source;
  }

  public async collect(): Promise<MarketDataCollectionResult> {
    const url = new URL(this.config.path, this.config.baseUrl);

    url.searchParams.set(this.config.actionKey, this.config.actionValue);

    const response = await axios.get<MarketDataApiResponse>(url.toString());

    if (!response.data.success) {
      throw new Error(`${this.source} returned unsuccessful response`);
    }

    return {
      collectedAt: new Date(response.data.current_time * 1000),
      quotes: response.data.data.map((item) => ({
        asset: {
          name: item.type_code,
          symbol: item.type_code,
          type: ASSET_TYPES.gold,
        },
        buyChange: item.change_buy,
        buyPrice: item.buy,
        sellChange: item.change_sell,
        sellPrice: item.sell,
        source: this.source,
        sourceUpdatedAt: new Date(
          (item.update_time ?? response.data.current_time) * 1000,
        ),
      })),
      source: this.source,
      sourcePayload: response.data,
    };
  }
}
