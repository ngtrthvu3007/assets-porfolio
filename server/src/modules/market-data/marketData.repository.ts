import type { MarketDataIngestion, Prisma } from "@prisma/client";
import { prisma } from "../../libs/prisma.js";
import { toJsonInput } from "../../utils/helper.js";
import type { MarketQuote } from "../../types/marketData.js";

export interface CreateIngestionInput {
  completedAt: Date;
  errorMessage?: string;
  sourceCode: string;
  sourcePayload?: unknown;
  startedAt: Date;
  status: "failed" | "success";
}

interface CreateMarketQuotesInput {
  collectedAt: Date;
  ingestionId: string;
  quotes: MarketQuote[];
  sourceId: string;
}

export const createIngestionRepo = async (input: CreateIngestionInput): Promise<MarketDataIngestion> => {
  const data: Prisma.MarketDataIngestionCreateInput = {
    completedAt: input.completedAt,
    errorMessage: input.errorMessage,
    source: { connect: { code: input.sourceCode } },
    startedAt: input.startedAt,
    status: input.status,
  };

  if (input.sourcePayload !== undefined) {
    data.sourcePayload = toJsonInput(input.sourcePayload);
  }

  return prisma.marketDataIngestion.create({ data });
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
        buyPrice: quote.buyPrice,
        collectedAt: input.collectedAt,
        ingestionId: input.ingestionId,
        sellPrice: quote.sellPrice,
        sourceId: input.sourceId,
        sourceUpdatedAt: quote.sourceUpdatedAt,
      };
    }),
  });
};
