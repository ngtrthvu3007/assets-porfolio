export type PriceAction = "current" | "summary";

export interface GetPricesQuery {
  action: PriceAction;
  days: number | null;
  type: string | null;
}
