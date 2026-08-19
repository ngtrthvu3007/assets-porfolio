import { Injectable, NotFoundException } from '@nestjs/common';
import {
  buildPaginationMeta,
  DEFAULT_PAGE,
  DEFAULT_PAGE_SIZE,
  DEFAULT_PRICE_DETAIL_RANGE,
  DEFAULT_PRICE_SORT,
  DEFAULT_SORT_ORDER,
  PRICE_LIST_SORT_VALUES,
  SORT_ORDER_VALUES,
  toNullableNumber,
} from '@shared';
import type { Prisma } from '@prisma/client';
import { ChartsService } from '../charts/charts.service';
import {
  ListLatestPricesQueryDto,
  ListPricesQueryDto,
} from './dto/list-prices-query.dto';
import {
  ListLatestPricesResponseDto,
  ListPricesResponseDto,
  ListPriceTypesResponseDto,
} from './dto/list-prices-response.dto';
import { PricesRepository } from './prices.repository';
import type { GetPriceDetailParams, PriceQuoteWithAsset } from './prices.types';

@Injectable()
export class PricesService {
  public constructor(
    private readonly chartsService: ChartsService,
    private readonly pricesRepository: PricesRepository,
  ) {}

  public async listPricesService(
    query: ListPricesQueryDto,
  ): Promise<ListPricesResponseDto> {
    const page = Number(query.page ?? DEFAULT_PAGE);
    const pageSize = Number(query.pageSize ?? DEFAULT_PAGE_SIZE);

    const params = {
      type: query.type.trim().toLowerCase(),
      q: query.q?.trim() || undefined,
      order: query.order ?? DEFAULT_SORT_ORDER,
      page,
      pageSize,
      sort: query.sort ?? DEFAULT_PRICE_SORT,
    };

    const { items: quotes, total } =
      await this.pricesRepository.listQuotesRepo(params);

    const items = quotes.map((quote) => this.toPriceListItem(quote));

    return {
      currentTime: new Date(),
      items,
      pagination: buildPaginationMeta(params.page, params.pageSize, total),
      type: params.type,
    };
  }

  public async listLatestPricesService(
    query: ListLatestPricesQueryDto,
  ): Promise<ListLatestPricesResponseDto> {
    const type = query.type.trim().toLowerCase();
    const quotes = await this.pricesRepository.listLatestQuotesRepo({ type });

    return {
      currentTime: new Date(),
      items: quotes.map((quote) => this.toPriceListItem(quote)),
      type,
    };
  }

  public async listPriceTypesService(): Promise<ListPriceTypesResponseDto> {
    const types = await this.pricesRepository.listPriceTypesRepo();

    // TODO: Asset's type need to manage in a table
    // to make backend needn't map or modify result
    const items = types.map((type) => {
      return { label: type.toUpperCase(), type };
    });

    return { items };
  }

  public async getPriceDetailService(input: GetPriceDetailParams) {
    const range = input.range ?? DEFAULT_PRICE_DETAIL_RANGE;
    const resolvedDateRange = this.chartsService.resolveDateRangeService(range);

    const quotes = await this.pricesRepository.listQuotesInRangeRepo({
      end: resolvedDateRange.end,
      start: resolvedDateRange.start,
      symbol: input.symbol,
      type: input.type,
    });
    const latestQuote = quotes[quotes.length - 1];

    if (!latestQuote) {
      throw new NotFoundException(
        `Price not found for ${input.type}/${input.symbol}`,
      );
    }

    // TODO: dedupes in JS on the full result set rather than at the DB
    // layer — deliberate tradeoff for portability across the planned
    // Postgres migration. See ChartsService.dedupeByDayService for why.
    const dedupedQuotes = this.chartsService.dedupeByDayService(quotes, range);

    const history = dedupedQuotes.map((quote) => this.toQuoteBaseFields(quote));

    return {
      asset: {
        name: latestQuote.asset.name,
        symbol: latestQuote.asset.symbol,
        type: latestQuote.asset.type,
      },
      history,
      latest: {
        ...this.toQuoteBaseFields(latestQuote),
        buyChange: toNullableNumber(latestQuote.buyChange),
        sellChange: toNullableNumber(latestQuote.sellChange),
      },
      source: { code: latestQuote.source.code, name: latestQuote.source.name },
    };
  }

  private toPriceListItem(quote: PriceQuoteWithAsset) {
    return {
      ...this.toQuoteBaseFields(quote),
      buyChange: toNullableNumber(quote.buyChange),
      name: quote.asset.name,
      sellChange: toNullableNumber(quote.sellChange),
      symbol: quote.asset.symbol,
      type: quote.asset.type,
    };
  }

  private toQuoteBaseFields(quote: {
    buyPrice: Prisma.Decimal | null;
    collectedAt: Date;
    sellPrice: Prisma.Decimal | null;
    sourceUpdatedAt: Date;
  }) {
    return {
      buyPrice: toNullableNumber(quote.buyPrice),
      collectedAt: quote.collectedAt.toISOString(),
      sellPrice: toNullableNumber(quote.sellPrice),
      sourceUpdatedAt: quote.sourceUpdatedAt.toISOString(),
    };
  }
}
