import type { MarketDataIngestion, Prisma } from "@prisma/client";
import { prisma } from "../../libs/prisma.js";
import { toJsonInput } from "../../utils/helper.js";
import type { MarketQuote } from "../../types/marketData.js";

export interface CreateIngestionInput {
  completedAt: Date;
  errorMessage?: string;
  sourceCode: string;
  sourcePayload?: unknown;
  sourceUpdatedAt?: Date;
  startedAt: Date;
  status: "failed" | "no_change" | "success";
}

interface CreateMarketQuotesInput {
  collectedAt: Date;
  ingestionId: string;
  quotes: MarketQuote[];
  sourceId: string;
}

interface HasMarketDataIngestionInput {
  sourceId: string;
  sourceUpdatedAt: Date;
}

export const getMarketDataSourceByCodeRepo = async (code: string) => {
  return prisma.marketDataSource.findUniqueOrThrow({ select: { id: true }, where: { code } });
};

export const createIngestionRepo = async (input: CreateIngestionInput): Promise<MarketDataIngestion> => {
  const data: Prisma.MarketDataIngestionCreateInput = {
    completedAt: input.completedAt,
    errorMessage: input.errorMessage,
    source: { connect: { code: input.sourceCode } },
    sourceUpdatedAt: input.sourceUpdatedAt,
    startedAt: input.startedAt,
    status: input.status,
  };

  if (input.sourcePayload !== undefined) {
    data.sourcePayload = toJsonInput(input.sourcePayload);
  }

  return prisma.marketDataIngestion.create({ data });
};

export const hasMarketDataIngestionRepo = async (
  input: HasMarketDataIngestionInput,
): Promise<boolean> => {
  const existingIngestion = await prisma.marketDataIngestion.findFirst({
    select: { id: true },
    where: { sourceId: input.sourceId, sourceUpdatedAt: input.sourceUpdatedAt },
  });

  return Boolean(existingIngestion);
};

export const createMarketQuotesRepo = async (input: CreateMarketQuotesInput) => {
  const assetSymbols = input.quotes.map((quote) => quote.asset.symbol.trim().toUpperCase());
  // createMany needs scalar assetId values, so resolve seeded assets first.
  const assets = await prisma.asset.findMany({
    select: { id: true, symbol: true },
    where: { symbol: { in: assetSymbols } },
  });
  const assetIdsBySymbol = Object.fromEntries(assets.map((asset) => [asset.symbol, asset.id]));

  await prisma.marketQuote.createMany({
    data: input.quotes.map((quote) => {
      const assetSymbol = quote.asset.symbol.trim().toUpperCase();

      return {
        assetId: assetIdsBySymbol[assetSymbol],
        buyChange: quote.buyChange,
        buyPrice: quote.buyPrice,
        collectedAt: input.collectedAt,
        ingestionId: input.ingestionId,
        sellChange: quote.sellChange,
        sellPrice: quote.sellPrice,
        sourceId: input.sourceId,
        sourceUpdatedAt: quote.sourceUpdatedAt,
      };
    }),
  });
};
