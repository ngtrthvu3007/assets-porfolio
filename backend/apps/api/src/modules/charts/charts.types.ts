import { PRICE_DETAIL_RANGE_VALUES } from '@shared';

export type ChartRange = (typeof PRICE_DETAIL_RANGE_VALUES)[number];

export interface ResolvedDateRange {
  end: Date;
  start: Date;
}

export interface ChartTimestamped {
  sourceUpdatedAt: Date;
}
