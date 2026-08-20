export interface GoldProviderAApiItem {
  buy: number;
  change_buy: number;
  change_sell: number;
  sell: number;
  type_code: string;
  update_time?: number;
}

export interface GoldProviderAApiResponse {
  current_time: number;
  data: GoldProviderAApiItem[];
  success: boolean;
}
