import { Injectable, NotFoundException } from '@nestjs/common';
import {
  buildPaginationMeta,
  DEFAULT_PAGE,
  DEFAULT_PAGE_SIZE,
  DEFAULT_PRICE_SORT,
  DEFAULT_SORT_ORDER,
  PRICE_LIST_SORT_VALUES,
  SORT_ORDER_VALUES,
} from '@shared';
import type { Prisma } from '@prisma/client';
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

type PriceQuoteWithAsset = Prisma.MarketQuoteGetPayload<{
  include: { asset: true };
}>;

interface GetPriceDetailInput {
  days?: string;
  symbol: string;
  type: string;
}

@Injectable()
export class PricesService {
  public constructor(private readonly pricesRepository: PricesRepository) {}

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

  public async getPriceDetailService(input: GetPriceDetailInput) {
    const days = input.days ? Number(input.days) : null;
    const quotes = await this.pricesRepository.listQuotesByAssetRepo({
      days,
      symbol: input.symbol,
      type: input.type,
    });
    const latestQuote = quotes[0];

    if (!latestQuote) {
      throw new NotFoundException(
        `Price not found for ${input.type}/${input.symbol}`,
      );
    }

    const history = days
      ? quotes
          .filter(
            (quote) =>
              quote.sourceUpdatedAt >=
              new Date(Date.now() - days * 24 * 60 * 60 * 1000),
          )
          .map((quote) => ({
            buyPrice: quote.buyPrice ? quote.buyPrice.toNumber() : null,
            collectedAt: quote.collectedAt.toISOString(),
            sellPrice: quote.sellPrice ? quote.sellPrice.toNumber() : null,
            sourceUpdatedAt: quote.sourceUpdatedAt.toISOString(),
          }))
          .reverse()
      : [];

    return {
      asset: {
        name: latestQuote.asset.name,
        symbol: latestQuote.asset.symbol,
        type: latestQuote.asset.type,
      },
      history,
      latest: {
        buyChange: latestQuote.buyChange
          ? latestQuote.buyChange.toNumber()
          : null,
        buyPrice: latestQuote.buyPrice ? latestQuote.buyPrice.toNumber() : null,
        collectedAt: latestQuote.collectedAt.toISOString(),
        sellChange: latestQuote.sellChange
          ? latestQuote.sellChange.toNumber()
          : null,
        sellPrice: latestQuote.sellPrice
          ? latestQuote.sellPrice.toNumber()
          : null,
        sourceUpdatedAt: latestQuote.sourceUpdatedAt.toISOString(),
      },
      source: { code: latestQuote.source.code, name: latestQuote.source.name },
    };
  }

  private toPriceListItem(quote: PriceQuoteWithAsset) {
    return {
      buyChange: quote.buyChange?.toNumber() ?? null,
      buyPrice: quote.buyPrice?.toNumber() ?? null,
      collectedAt: quote.collectedAt.toISOString(),
      name: quote.asset.name,
      sellChange: quote.sellChange?.toNumber() ?? null,
      sellPrice: quote.sellPrice?.toNumber() ?? null,
      sourceUpdatedAt: quote.sourceUpdatedAt.toISOString(),
      symbol: quote.asset.symbol,
      type: quote.asset.type,
    };
  }
}
