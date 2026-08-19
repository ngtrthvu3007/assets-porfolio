import { PRICE_LIST_SORT_VALUES, SORT_ORDER_VALUES } from '@shared';
import type { Prisma } from '@prisma/client';
import type { ChartRange } from '../charts/charts.types';

export type PriceListSort = (typeof PRICE_LIST_SORT_VALUES)[number];
export type PriceListOrder = (typeof SORT_ORDER_VALUES)[number];

export type PriceQuoteWithAsset = Prisma.MarketQuoteGetPayload<{
  include: { asset: true };
}>;

export interface ListQuotesParams {
  order: PriceListOrder | string;
  page: number;
  pageSize: number;
  q?: string;
  sort: PriceListSort | string;
  type: string;
}

export interface ListLatestQuotesParams {
  type: string;
}

export interface ListQuotesInRangeParams {
  end: Date;
  start: Date;
  symbol: string;
  type: string;
}

export interface GetPriceDetailParams {
  range?: ChartRange;
  symbol: string;
  type: string;
}
