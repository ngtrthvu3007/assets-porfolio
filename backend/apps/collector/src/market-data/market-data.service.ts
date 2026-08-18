import { Injectable, Logger } from '@nestjs/common';
import type { MarketDataCollectionResult } from '@shared/types/market-data';
import { getErrorMessage } from '@shared/utils/errors.util';
import { MarketDataRepository } from './market-data.repository';
import type { MarketDataCollector } from './types/market-data-collector.type';

@Injectable()
export class MarketDataService {
  private readonly logger = new Logger(MarketDataService.name);

  public constructor(
    private readonly marketDataRepository: MarketDataRepository,
  ) {}

  public async ingestMarketDataService(
    collector: MarketDataCollector,
  ): Promise<MarketDataCollectionResult | null> {
    const startedAt = new Date();

    this.logger.log(`Starting market data collect: ${collector.source}`);

    try {
      // 1. Fetch the latest quotes from the source.
      const result = await collector.collect();

      // 2. Persist the ingestion, skipping quotes if data hasn't changed.
      await this.saveCollectionService({ collector, result, startedAt });

      return result;
    } catch (error) {
      // Collect failed: record the failure and stop, no data to persist.
      await this.saveFailedCollectionService({ collector, error, startedAt });

      return null;
    }
  }

  private async saveCollectionService(input: {
    collector: MarketDataCollector;
    result: MarketDataCollectionResult;
    startedAt: Date;
  }) {
    const { collector, result, startedAt } = input;
    const sourceCode = collector.source;
    const source =
      await this.marketDataRepository.getMarketDataSourceByCodeRepo(sourceCode);

    // Source stamps one update time per collection batch, so the first
    // quote's sourceUpdatedAt represents the whole result set's data version.
    // Compare it against past ingestions to detect an unchanged snapshot.
    const sourceUpdatedAt = result.quotes[0]?.sourceUpdatedAt;
    const hasExistingData = sourceUpdatedAt
      ? await this.marketDataRepository.hasMarketDataIngestionRepo({
          sourceId: source.id,
          sourceUpdatedAt,
        })
      : false;

    // Always record the ingestion attempt for monitoring, whether or not
    // the data changed.
    const ingestion = await this.marketDataRepository.createIngestionRepo({
      completedAt: new Date(),
      sourceCode,
      sourcePayload: result.sourcePayload,
      sourceUpdatedAt,
      startedAt,
      status: hasExistingData ? 'no_change' : 'success',
    });

    // Same data version as before: don't duplicate quotes.
    if (hasExistingData) {
      this.logger.log(
        `Market data collect completed: ${sourceCode} (no_change)`,
      );

      return;
    }

    // New data version: persist the quotes for this ingestion.
    await this.marketDataRepository.createMarketQuotesRepo({
      collectedAt: result.collectedAt,
      ingestionId: ingestion.id,
      quotes: result.quotes,
      sourceId: source.id,
    });

    this.logger.log(
      `Market data collect completed: ${sourceCode} (${result.quotes.length} quotes)`,
    );
  }

  private async saveFailedCollectionService(input: {
    collector: MarketDataCollector;
    error: unknown;
    startedAt: Date;
  }) {
    const { collector, error, startedAt } = input;
    const errorMessage = getErrorMessage(error);

    await this.marketDataRepository.createIngestionRepo({
      completedAt: new Date(),
      errorMessage,
      sourceCode: collector.source,
      startedAt,
      status: 'failed',
    });

    this.logger.error(
      `Market data collect failed: ${collector.source} - ${errorMessage}`,
    );
  }
}
