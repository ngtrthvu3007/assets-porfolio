import { Injectable } from '@nestjs/common';
import { PrismaService } from '@database';
import type { MarketDataIngestion, Prisma } from '@prisma/client';
import { toJsonInput } from '@shared/utils/json.util';
import type {
  CreateIngestionInput,
  CreateMarketQuotesInput,
  HasMarketDataIngestionInput,
} from './types/market-data-repository.type';

@Injectable()
export class MarketDataRepository {
  public constructor(private readonly prismaService: PrismaService) {}

  public getMarketDataSourceByCodeRepo(code: string) {
    return this.prismaService.marketDataSource.findUniqueOrThrow({
      select: { id: true },
      where: { code },
    });
  }

  public createIngestionRepo(
    input: CreateIngestionInput,
  ): Promise<MarketDataIngestion> {
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

    return this.prismaService.marketDataIngestion.create({ data });
  }

  public async hasMarketDataIngestionRepo(input: HasMarketDataIngestionInput) {
    const existingIngestion =
      await this.prismaService.marketDataIngestion.findFirst({
        select: { id: true },
        where: {
          sourceId: input.sourceId,
          sourceUpdatedAt: input.sourceUpdatedAt,
        },
      });

    return Boolean(existingIngestion);
  }

  public async createMarketQuotesRepo(input: CreateMarketQuotesInput) {
    const assetSymbols = input.quotes.map((quote) =>
      quote.asset.symbol.trim().toUpperCase(),
    );
    const assets = await this.prismaService.asset.findMany({
      select: { id: true, symbol: true },
      where: { symbol: { in: assetSymbols } },
    });
    const assetIdsBySymbol = Object.fromEntries(
      assets.map((asset) => [asset.symbol, asset.id]),
    );

    await this.prismaService.marketQuote.createMany({
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
  }
}
