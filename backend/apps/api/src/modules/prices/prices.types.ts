import { PRICE_LIST_SORT_VALUES, SORT_ORDER_VALUES } from '@shared';

export type PriceListSort = (typeof PRICE_LIST_SORT_VALUES)[number];
export type PriceListOrder = (typeof SORT_ORDER_VALUES)[number];

export interface ListQuotesParams {
  order: PriceListOrder | string;
  page: number;
  pageSize: number;
  q?: string;
  sort: PriceListSort | string;
  type: string;
}

export interface ListQuotesByAssetParams {
  days: number | null;
  symbol: string;
  type: string;
}

export interface ListLatestQuotesParams {
  type: string;
}
