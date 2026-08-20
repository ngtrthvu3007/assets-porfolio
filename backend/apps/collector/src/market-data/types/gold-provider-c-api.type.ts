export interface GoldProviderCApiPriceStats {
  avg: number;
  close: number;
  high: number;
  low: number;
  open: number;
}

export interface GoldProviderCApiProduct {
  buy: GoldProviderCApiPriceStats;
  name: string;
  sell: GoldProviderCApiPriceStats;
}

export interface GoldProviderCApiDay {
  date: string;
  products: GoldProviderCApiProduct[];
  scrape_count: number;
  status: 'final' | 'live';
}

export interface GoldProviderCApiResponse {
  data: {
    days: GoldProviderCApiDay[];
    profile_id: number;
    render_id: number;
  };
  success: boolean;
}
