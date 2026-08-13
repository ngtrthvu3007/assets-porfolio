export type PriceAction = "current" | "summary";

export interface PriceQuery {
  type?: string;
  days?: number;
  action?: PriceAction;
}

export interface PriceItem {
  type_code: string;
  buy: number;
  sell: number;
  change_buy: number;
  change_sell: number;
  update_time: number;
}

export interface PricesResponse {
  success: boolean;
  current_time: number;
  data: PriceItem[];
}

export interface PricesData {
  currentTime: number;
  items: PriceItem[];
}

export interface PriceTableRow {
  typeCode: string;
  buy: string;
  sell: string;
  buyChange: string;
  sellChange: string;
  buyChangeClass: string;
  sellChangeClass: string;
  updatedAt: string;
}
