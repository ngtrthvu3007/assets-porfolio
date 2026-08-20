export const DEFAULT_PAGE = 1;
export const DEFAULT_PAGE_SIZE = 20;

export const SORT_ORDER = { ASC: 'asc', DESC: 'desc' } as const;
export const SORT_ORDER_VALUES = Object.values(SORT_ORDER);
export const DEFAULT_SORT_ORDER = SORT_ORDER.DESC;
