import { getRequiredEnv } from "../../../config/env.js";
import { DEFAULT_COLLECTION_CRON } from "../../../constants/marketData.js";
import { httpClient } from "../../../libs/httpClient.js";
import { ASSET_TYPES } from "../../../types/assets.js";
import type { MarketDataCollectionResult } from "../../../types/marketData.js";
import type { MarketDataCollector } from "../marketData.collector.js";

const VANG_TODAY_SOURCE = "vang.today";

interface VangTodayPriceItem {
  buy: number;
  sell: number;
  type_code: string;
  update_time: number;
}

interface VangTodayPricesResponse {
  current_time: number;
  data: VangTodayPriceItem[];
  success: boolean;
}

export class VangTodayCollector implements MarketDataCollector {
  public readonly cronExpression = process.env.VANG_TODAY_COLLECTION_CRON ?? DEFAULT_COLLECTION_CRON;

  public readonly source = VANG_TODAY_SOURCE;

  public async collect(): Promise<MarketDataCollectionResult> {
    const url = new URL("/api/prices", getRequiredEnv("VANG_TODAY_API_BASE_URL"));

    url.searchParams.set("action", "current");

    const response = await httpClient.get<VangTodayPricesResponse>(url.toString());

    if (!response.success) throw new Error(`${this.source} returned unsuccessful response`);

    const result: MarketDataCollectionResult = {
      collectedAt: new Date(response.current_time * 1000),
      quotes: response.data.map((item) => ({
        asset: { name: item.type_code, symbol: item.type_code, type: ASSET_TYPES.gold },
        buyPrice: item.buy,
        sellPrice: item.sell,
        source: this.source,
        sourceUpdatedAt: new Date(item.update_time * 1000),
      })),
      source: this.source,
      sourcePayload: response,
    };

    return result;
  }
}
