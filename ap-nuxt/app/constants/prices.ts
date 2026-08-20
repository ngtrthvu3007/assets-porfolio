import type { LatestPricesQuery, PriceDetailRange, PriceListSort, SortOrder } from "@/types/prices";

export const DEFAULT_LATEST_PRICES_QUERY: LatestPricesQuery = { type: "gold" };

export const SORT_ORDER = { ASC: "asc", DESC: "desc" } as const satisfies Record<string, SortOrder>;

export const DEFAULT_PRICE_LIST_SORT: PriceListSort = "sourceUpdatedAt";

export const PRICE_LIST_SORTABLE_COLUMNS: { field: PriceListSort; label: string }[] = [
  { field: DEFAULT_PRICE_LIST_SORT, label: "Thời gian" },
  { field: "buyPrice", label: "Mua vào" },
  { field: "sellPrice", label: "Bán ra" },
];

// Vietnamese display labels for asset types — the backend's own label is
// derived from the raw type code (e.g. "GOLD"), so the UI maps it here
// instead. Unmapped types fall back to the backend-provided label.
export const ASSET_TYPE_LABELS: Record<string, string> = {
  gold: "Vàng",
  stock: "Cổ phiếu",
  crypto: "Tiền số",
};

export const PRICE_DETAIL_RANGE_OPTIONS: { value: PriceDetailRange; label: string }[] = [
  { value: "today", label: "Hôm nay" },
  { value: "7d", label: "7 ngày" },
  { value: "15d", label: "15 ngày" },
  { value: "30d", label: "30 ngày" },
  { value: "this_month", label: "Tháng này" },
  { value: "last_month", label: "Tháng trước" },
];

export const PRICES_QUERY_KEYS = {
  detail: (type: string, symbol: string, range?: string) =>
    ["prices", "detail", type, symbol, range] as const,
  latest: (type: string) => ["prices", "latest", type] as const,
  list: (type: string, q?: string, page?: number, pageSize?: number, sort?: string, order?: string) =>
    ["prices", "list", type, q, page, pageSize, sort, order] as const,
  types: ["prices", "types"] as const,
};
