export const DEFAULT_COLLECTION_CRON = '*/5 * * * *';

export const PRICE_LIST_SORT_VALUES = [
  'buyPrice',
  'sellPrice',
  'sourceUpdatedAt',
] as const;

export const DEFAULT_PRICE_SORT = 'sourceUpdatedAt';

// Preset windows for the price detail chart — kept small and fixed so
// history queries can't be asked for an unbounded date range.
// Rolling windows (TODAY/SEVEN_D/FIFTEEN_D/THIRTY_D) always end at now;
// calendar windows (THIS_WEEK/LAST_WEEK/THIS_MONTH/LAST_MONTH) are fixed to
// calendar boundaries instead. Both render as one continuous line chart —
// they only differ in how the start/end dates are computed.
export const PRICE_DETAIL_RANGE = {
  TODAY: 'today',
  SEVEN_D: '7d',
  FIFTEEN_D: '15d',
  THIRTY_D: '30d',
  THIS_WEEK: 'this_week',
  LAST_WEEK: 'last_week',
  THIS_MONTH: 'this_month',
  LAST_MONTH: 'last_month',
  CUSTOM: 'custom',
} as const;

export const PRICE_DETAIL_RANGE_VALUES = Object.values(PRICE_DETAIL_RANGE);

export const DEFAULT_PRICE_DETAIL_RANGE = PRICE_DETAIL_RANGE.TODAY;

// Day counts backing the rolling-window range presets above.
export const PRICE_DETAIL_RANGE_ROLLING_DAYS: Partial<
  Record<(typeof PRICE_DETAIL_RANGE_VALUES)[number], number>
> = {
  [PRICE_DETAIL_RANGE.SEVEN_D]: 7,
  [PRICE_DETAIL_RANGE.FIFTEEN_D]: 15,
  [PRICE_DETAIL_RANGE.THIRTY_D]: 30,
};
