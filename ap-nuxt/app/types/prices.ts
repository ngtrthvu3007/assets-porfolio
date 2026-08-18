export interface LatestPricesQuery {
  type: string
}

export interface PriceItem {
  buyChange: number | null
  buyPrice: number | null
  collectedAt: string
  name: string
  sellChange: number | null
  sellPrice: number | null
  sourceUpdatedAt: string
  symbol: string
  type: string
}

export interface LatestPricesResponse {
  currentTime: string
  items: PriceItem[]
  type: string
}

export interface PriceTableRow {
  symbol: string
  buy: string
  sell: string
  name: string
  buyChange: string
  sellChange: string
  buyChangeClass: string
  sellChangeClass: string
  updatedAt: string
}
