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
  page: number;
  pageSize: number;
  q?: string;
  type: string;
}

export interface AssetIdentity {
  symbol: string;
  type: string;
}

export interface ListQuotesInRangeParams extends AssetIdentity {
  end: Date;
  start: Date;
}

export interface GetPriceDetailParams extends AssetIdentity {
  range?: ChartRange;
}
