import { Injectable } from '@nestjs/common';
import { PrismaService } from '@database';
import { DEFAULT_SORT_ORDER } from '@shared';
import type { Prisma } from '@prisma/client';
import type {
  ListLatestQuotesParams,
  ListQuotesInRangeParams,
  ListQuotesParams,
} from './prices.types';

@Injectable()
export class PricesRepository {
  public constructor(private readonly prismaService: PrismaService) {}

  public async listPriceTypesRepo() {
    const assets = await this.prismaService.asset.findMany({
      distinct: ['type'],
      orderBy: { type: 'asc' },
      select: { type: true },
      where: { deletedAt: null },
    });

    return assets.map((asset) => asset.type);
  }

  public async listQuotesRepo(query: ListQuotesParams) {
    const where: Prisma.MarketQuoteWhereInput = {
      asset: {
        deletedAt: null,
        type: query.type,
        // Search matches either the asset name or its symbol.
        ...(query.q
          ? {
              OR: [
                { name: { contains: query.q } },
                { symbol: { contains: query.q } },
              ],
            }
          : undefined),
      },
      deletedAt: null,
    };

    const [items, total] = await Promise.all([
      this.prismaService.marketQuote.findMany({
        include: { asset: true },
        orderBy: [
          { [query.sort]: query.order },
          { collectedAt: DEFAULT_SORT_ORDER },
        ],
        skip: (query.page - 1) * query.pageSize,
        take: query.pageSize,
        where,
      }),
      this.prismaService.marketQuote.count({ where }),
    ]);

    return { items, total };
  }

  public async listLatestQuotesRepo(query: ListLatestQuotesParams) {
    return this.prismaService.marketQuote.findMany({
      distinct: ['assetId'],
      include: { asset: true },
      orderBy: [{ assetId: 'asc' }, { sourceUpdatedAt: DEFAULT_SORT_ORDER }],
      where: {
        asset: { deletedAt: null, type: query.type },
        deletedAt: null,
      },
    });
  }

  // Filters by sourceUpdatedAt directly in the query so the DB never
  // returns more rows than the requested [start, end] window covers.
  public async listQuotesInRangeRepo(input: ListQuotesInRangeParams) {
    return this.prismaService.marketQuote.findMany({
      include: { asset: true, source: true },
      orderBy: [{ sourceUpdatedAt: 'asc' }, { collectedAt: 'asc' }],
      where: {
        asset: {
          deletedAt: null,
          symbol: input.symbol,
          type: input.type,
        },
        deletedAt: null,
        source: { deletedAt: null },
        sourceUpdatedAt: { gte: input.start, lte: input.end },
      },
    });
  }
}
