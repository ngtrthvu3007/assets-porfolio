import type {
  ListPricesParams,
  ListPricesQuery,
  PriceListSort,
} from "../../dtos/prices.dto.js";
import { appError } from "../../middleware/errorHandler.js";
import {
  listPriceTypesRepo,
  listQuotesRepo,
  listQuotesByAssetRepo,
  type PriceQuoteRecord,
  type PriceQuoteWithSourceRecord,
} from "./prices.repository.js";

interface GetPriceDetailInput {
  days: number | null;
  symbol: string;
  type: string;
}

export const listPricesService = async (query: ListPricesQuery) => {
  const params = toListPricesParams(query);
  const { items: quotes, total } = await listQuotesRepo(params);
  const items = quotes.map(toPriceListItem);

  return {
    currentTime: new Date(),
    items,
    pagination: {
      page: params.page,
      pageSize: params.pageSize,
      total,
      totalPages: Math.ceil(total / params.pageSize),
    },
    type: params.type,
  };
};

export const listPriceTypesService = async () => {
  const types = await listPriceTypesRepo();

  return { items: types.map((type) => ({ label: toTypeLabel(type), type })) };
};

export const getPriceDetailService = async (input: GetPriceDetailInput) => {
  const quotes = await listQuotesByAssetRepo(input);
  const latestQuote = quotes[0];

  if (!latestQuote) {
    throw appError(
      404,
      "PRICE_NOT_FOUND",
      `Price not found for ${input.type}/${input.symbol}`,
    );
  }

  const history = input.days ? getHistory(quotes, input.days) : [];

  return {
    asset: toAsset(latestQuote),
    history,
    latest: toSnapshot(latestQuote),
    source: toSource(latestQuote),
  };
};

const toPriceListItem = (quote: PriceQuoteRecord) => {
  return {
    asset: toAsset(quote),
    ...toSnapshot(quote),
  };
};

const toSnapshot = (quote: PriceQuoteRecord) => {
  return {
    buyChange: toNumber(quote.buyChange),
    buyPrice: toNumber(quote.buyPrice),
    collectedAt: quote.collectedAt.toISOString(),
    sellChange: toNumber(quote.sellChange),
    sellPrice: toNumber(quote.sellPrice),
    sourceUpdatedAt: quote.sourceUpdatedAt.toISOString(),
  };
};

const toHistory = (quote: PriceQuoteRecord) => {
  return {
    buyPrice: toNumber(quote.buyPrice),
    collectedAt: quote.collectedAt.toISOString(),
    sellPrice: toNumber(quote.sellPrice),
    sourceUpdatedAt: quote.sourceUpdatedAt.toISOString(),
  };
};

const getHistory = (quotes: PriceQuoteRecord[], days: number) => {
  const sourceUpdatedAfter = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

  return quotes
    .filter((quote) => quote.sourceUpdatedAt >= sourceUpdatedAfter)
    .map(toHistory)
    .reverse();
};

const toAsset = (quote: PriceQuoteRecord) => {
  return {
    name: quote.asset.name,
    symbol: quote.asset.symbol,
    type: quote.asset.type,
  };
};

const toSource = (quote: PriceQuoteWithSourceRecord) => {
  return { code: quote.source.code, name: quote.source.name };
};

const toNumber = (value: PriceQuoteRecord["buyPrice"]) => {
  return value ? value.toNumber() : null;
};

const toListPricesParams = (query: ListPricesQuery): ListPricesParams => {
  const page = Number(query.page ?? 1);
  const pageSize = Number(query.pageSize ?? 50);
  const order = query.order === "asc" ? "asc" : "desc";
  const sortValues: PriceListSort[] = [
    "buyPrice",
    "name",
    "sellPrice",
    "symbol",
    "updatedAt",
  ];
  const sort =
    sortValues.find((sortValue) => sortValue === query.sort) ?? "updatedAt";

  return {
    order,
    page: Number.isInteger(page) && page > 0 ? page : 1,
    pageSize: Number.isInteger(pageSize) && pageSize > 0 ? pageSize : 50,
    q: query.q?.trim() || undefined,
    sort,
    source: query.source?.trim().toLowerCase() || undefined,
    type: query.type.trim().toLowerCase(),
  };
};

const toTypeLabel = (type: string) => {
  return type
    .split(/[-_\s]+/)
    .filter(Boolean)
    .map((word) => `${word[0]?.toUpperCase() ?? ""}${word.slice(1)}`)
    .join(" ");
};
