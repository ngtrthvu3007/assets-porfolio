export interface MarketDataApiItem {
  buy: number;
  change_buy: number;
  change_sell: number;
  sell: number;
  type_code: string;
  update_time?: number;
}

export interface MarketDataApiResponse {
  current_time: number;
  data: MarketDataApiItem[];
  success: boolean;
}
