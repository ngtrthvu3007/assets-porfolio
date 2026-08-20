import { Injectable } from '@nestjs/common';
import { PrismaService } from '@database';
import { DEFAULT_SORT_ORDER, SORT_ORDER } from '@shared';
import type { Prisma } from '@prisma/client';
import type {
  AssetIdentity,
  ListLatestQuotesParams,
  ListQuotesInRangeParams,
  ListQuotesParams,
} from './prices.types';

@Injectable()
export class PricesRepository {
  public constructor(private readonly prismaService: PrismaService) {}

  public async findAssetRepo(input: AssetIdentity) {
    return this.prismaService.asset.findFirst({
      where: { deletedAt: null, symbol: input.symbol, type: input.type },
    });
  }

  public async listPriceTypesRepo() {
    const assets = await this.prismaService.asset.findMany({
      distinct: ['type'],
      orderBy: { type: SORT_ORDER.DESC },
      select: { type: true },
      where: { deletedAt: null },
    });

    return assets.map((asset) => asset.type);
  }

  public async listQuotesRepo(query: ListQuotesParams) {
    const assetWhere = this.toAssetSearchWhere(query);
    const where: Prisma.MarketQuoteWhereInput = {
      asset: assetWhere,
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
    const assetWhere = this.toAssetSearchWhere(query);

    const [items, total] = await Promise.all([
      this.prismaService.marketQuote.findMany({
        distinct: ['assetId'],
        include: { asset: true },
        orderBy: [
          { assetId: SORT_ORDER.ASC },
          { sourceUpdatedAt: DEFAULT_SORT_ORDER },
        ],
        skip: (query.page - 1) * query.pageSize,
        take: query.pageSize,
        where: { asset: assetWhere, deletedAt: null },
      }),
      this.prismaService.asset.count({ where: assetWhere }),
    ]);

    return { items, total };
  }

  // Filters by sourceUpdatedAt directly in the query so the DB never
  // returns more rows than the requested [start, end] window covers.
  public async listQuotesInRangeRepo(input: ListQuotesInRangeParams) {
    return this.prismaService.marketQuote.findMany({
      include: { asset: true, source: true },
      orderBy: [
        { sourceUpdatedAt: SORT_ORDER.ASC },
        { collectedAt: SORT_ORDER.ASC },
      ],
      where: {
        ...this.toActiveQuoteWhere(input),
        sourceUpdatedAt: { gte: input.start, lte: input.end },
      },
    });
  }

  public async findLatestQuoteRepo(input: AssetIdentity) {
    return this.prismaService.marketQuote.findFirst({
      include: { asset: true, source: true },
      orderBy: this.toNewestFirstOrder(),
      where: this.toActiveQuoteWhere(input),
    });
  }

  public async findLastQuoteBeforeRepo(
    input: AssetIdentity & { before: Date },
  ) {
    return this.prismaService.marketQuote.findFirst({
      include: { asset: true, source: true },
      orderBy: this.toNewestFirstOrder(),
      where: {
        ...this.toActiveQuoteWhere(input),
        sourceUpdatedAt: { lt: input.before },
      },
    });
  }

  // Newest quote first — shared by every "latest as of X" lookup above.
  private toNewestFirstOrder(): Prisma.MarketQuoteOrderByWithRelationInput[] {
    return [{ sourceUpdatedAt: SORT_ORDER.DESC }, { collectedAt: SORT_ORDER.DESC }];
  }

  private toActiveQuoteWhere(input: AssetIdentity): Prisma.MarketQuoteWhereInput {
    return {
      asset: {
        deletedAt: null,
        symbol: input.symbol,
        type: input.type,
      },
      deletedAt: null,
      source: { deletedAt: null },
    };
  }

  // Search matches either the asset name or its symbol.
  private toAssetSearchWhere(input: {
    q?: string;
    type: string;
  }): Prisma.AssetWhereInput {
    return {
      deletedAt: null,
      type: input.type,
      ...(input.q
        ? {
            OR: [
              { name: { contains: input.q } },
              { symbol: { contains: input.q } },
            ],
          }
        : undefined),
    };
  }
}
