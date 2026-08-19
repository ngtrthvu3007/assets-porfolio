export const DEFAULT_COLLECTION_CRON = '*/5 * * * *';

export const PRICE_LIST_SORT_VALUES = [
  'buyPrice',
  'sellPrice',
  'sourceUpdatedAt',
] as const;

export const DEFAULT_PRICE_SORT = 'sourceUpdatedAt';

// Preset windows for the price detail chart — kept small and fixed so
// history queries can't be asked for an unbounded date range.
// Rolling windows (today/7d/15d/30d) always end at now; calendar windows
// (this_week/last_week/this_month/last_month) are fixed to calendar
// boundaries instead. Both render as one continuous line chart — they only
// differ in how the start/end dates are computed.
export const PRICE_DETAIL_RANGE_VALUES = [
  'today',
  '7d',
  '15d',
  '30d',
  'this_week',
  'last_week',
  'this_month',
  'last_month',
] as const;

export const DEFAULT_PRICE_DETAIL_RANGE = 'today';
