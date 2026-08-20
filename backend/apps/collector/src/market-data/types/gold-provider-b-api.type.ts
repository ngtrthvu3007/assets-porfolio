export interface GoldProviderBApiItem {
  buyChange: number;
  buyChangePercent: number;
  buyingPrice: number;
  code: string;
  dateTime: string;
  sellChange: number;
  sellChangePercent: number;
  sellingPrice: number;
}

export type GoldProviderBApiResponse = GoldProviderBApiItem[];
