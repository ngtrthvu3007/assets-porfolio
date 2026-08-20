export interface PaginationMeta {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export interface LatestPricesQuery {
  type: string;
  q?: string;
  page?: number;
  pageSize?: number;
}

export type PriceListSort = "buyPrice" | "sellPrice" | "sourceUpdatedAt";
export type SortOrder = "asc" | "desc";

export interface ListPricesQuery {
  type: string;
  q?: string;
  sort?: PriceListSort;
  order?: SortOrder;
  page?: number;
  pageSize?: number;
}

export interface PriceAsset {
  name: string;
  symbol: string;
  type: string;
}

export interface PriceQuote {
  buyPrice: number | null;
  sellPrice: number | null;
}

export interface PriceQuoteChange {
  buyChange: number | null;
  sellChange: number | null;
}

export interface PriceHistoryPoint extends PriceQuote {
  sourceUpdatedAt: string;
}

export interface PriceItem extends PriceAsset, PriceHistoryPoint, PriceQuoteChange {
  collectedAt: string;
}

export interface LatestPricesResponse {
  currentTime: string;
  items: PriceItem[];
  pagination: PaginationMeta;
  type: string;
}

export interface ListPricesResponse {
  currentTime: string;
  items: PriceItem[];
  pagination: PaginationMeta;
  type: string;
}

export interface PriceType {
  label: string;
  type: string;
}

export interface PriceTypesResponse {
  items: PriceType[];
}

export interface PriceTableRow {
  symbol: string;
  buy: string;
  sell: string;
  name: string;
  buyChange: string;
  sellChange: string;
  buyChangeClass: string;
  sellChangeClass: string;
  updatedAt: string;
}

export type PriceDetailRange =
  | "today"
  | "7d"
  | "15d"
  | "30d"
  | "this_week"
  | "last_week"
  | "this_month"
  | "last_month"
  | "custom";

export interface PriceDetailQuery {
  range?: PriceDetailRange;
  startDate?: string;
  endDate?: string;
}

export interface PriceDetailParams {
  type: string;
  symbol: string;
}

export interface PriceDetailLatest extends PriceQuote, PriceQuoteChange {
  collectedAt: string | null;
  sourceUpdatedAt: string | null;
}

export interface PriceDetailStats {
  buyOpen: number | null;
  buyClose: number | null;
  buyChangePercent: number | null;
  sellOpen: number | null;
  sellClose: number | null;
  sellChangePercent: number | null;
}

export interface PriceDetailSource {
  code: string | null;
  name: string | null;
}

export interface PriceDetailResponse {
  asset: PriceAsset;
  history: PriceHistoryPoint[];
  latest: PriceDetailLatest;
  range: PriceDetailRange;
  source: PriceDetailSource;
  stats: PriceDetailStats;
}
