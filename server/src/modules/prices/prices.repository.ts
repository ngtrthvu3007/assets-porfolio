import type { Prisma } from "@prisma/client";
import type { ListPricesParams, PriceListOrder } from "../../dtos/prices.dto.js";
import { prisma } from "../../libs/prisma.js";

export type PriceQuoteRecord = Prisma.MarketQuoteGetPayload<{
  include: { asset: true };
}>;
export type PriceQuoteWithSourceRecord = Prisma.MarketQuoteGetPayload<{
  include: {
    asset: true;
    source: true;
  };
}>;

export const listPriceTypesRepo = async () => {
  const assets = await prisma.asset.findMany({
    distinct: ["type"],
    orderBy: { type: "asc" },
    select: { type: true },
    where: { deletedAt: null },
  });

  return assets.map((asset) => asset.type);
};

export const listQuotesRepo = async (query: ListPricesParams) => {
  const where = buildListQuotesWhere(query);
  const orderBy = buildListQuotesOrderBy(query.sort, query.order);
  const skip = (query.page - 1) * query.pageSize;

  const [items, total] = await Promise.all([
    prisma.marketQuote.findMany({
      include: { asset: true },
      orderBy,
      skip,
      take: query.pageSize,
      where,
    }),
    prisma.marketQuote.count({ where }),
  ]);

  return { items, total };
};

export const listQuotesByAssetRepo = async (input: {
  days: number | null;
  symbol: string;
  type: string;
}) => {
  return prisma.marketQuote.findMany({
    include: { asset: true, source: true },
    orderBy: [{ sourceUpdatedAt: "desc" }, { collectedAt: "desc" }],
    where: {
      deletedAt: null,
      asset: {
        deletedAt: null,
        symbol: input.symbol,
        type: input.type,
      },
      source: { deletedAt: null },
    },
    take: input.days ? undefined : 2,
  });
};

const buildListQuotesWhere = (
  query: ListPricesParams,
): Prisma.MarketQuoteWhereInput => {
  return {
    deletedAt: null,
    asset: {
      deletedAt: null,
      type: query.type,
      ...(query.q
        ? {
            OR: [
              { name: { contains: query.q } },
              { symbol: { contains: query.q } },
            ],
          }
        : {}),
    },
    source: {
      deletedAt: null,
      ...(query.source ? { code: query.source } : {}),
    },
  };
};

const buildListQuotesOrderBy = (
  sort: ListPricesParams["sort"],
  order: PriceListOrder,
): Prisma.MarketQuoteOrderByWithRelationInput[] => {
  const orderByMap: Record<
    ListPricesParams["sort"],
    Prisma.MarketQuoteOrderByWithRelationInput
  > = {
    buyPrice: { buyPrice: order },
    name: { asset: { name: order } },
    sellPrice: { sellPrice: order },
    symbol: { asset: { symbol: order } },
    updatedAt: { sourceUpdatedAt: order },
  };

  return [orderByMap[sort], { collectedAt: "desc" }];
};
