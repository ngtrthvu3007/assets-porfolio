import { ApiProperty } from '@nestjs/swagger';
import { PaginationResponseDto, PRICE_DETAIL_RANGE_VALUES } from '@shared';

export class PriceListItemDto {
  @ApiProperty({ example: 50000, nullable: true, type: Number })
  public buyChange!: number | null;

  @ApiProperty({ example: 7850000, nullable: true, type: Number })
  public buyPrice!: number | null;

  @ApiProperty({ example: '2026-08-17T02:00:00.000Z' })
  public collectedAt!: string;

  @ApiProperty({ example: 'SJC Gold' })
  public name!: string;

  @ApiProperty({ example: -20000, nullable: true, type: Number })
  public sellChange!: number | null;

  @ApiProperty({ example: 7950000, nullable: true, type: Number })
  public sellPrice!: number | null;

  @ApiProperty({ example: '2026-08-17T02:00:00.000Z' })
  public sourceUpdatedAt!: string;

  @ApiProperty({ example: 'SJC' })
  public symbol!: string;

  @ApiProperty({ example: 'gold' })
  public type!: string;
}

export class ListPricesResponseDto {
  @ApiProperty({ example: '2026-08-17T02:00:00.000Z' })
  public currentTime!: Date;

  @ApiProperty({ type: [PriceListItemDto] })
  public items!: PriceListItemDto[];

  @ApiProperty({ type: PaginationResponseDto })
  public pagination!: PaginationResponseDto;

  @ApiProperty({ example: 'gold' })
  public type!: string;
}

export class ListLatestPricesResponseDto {
  @ApiProperty({ example: '2026-08-17T02:00:00.000Z' })
  public currentTime!: Date;

  @ApiProperty({ type: [PriceListItemDto] })
  public items!: PriceListItemDto[];

  @ApiProperty({ example: 'gold' })
  public type!: string;
}

export class PriceTypeItemDto {
  @ApiProperty({ example: 'Gold' })
  public label!: string;

  @ApiProperty({ example: 'gold' })
  public type!: string;
}

export class ListPriceTypesResponseDto {
  @ApiProperty({
    example: [
      {
        label: 'GOLD',
        type: 'gold',
      },
    ],
  })
  public items!: PriceTypeItemDto[];
}

export class PriceDetailAssetDto {
  @ApiProperty({ example: 'SJC Gold' })
  public name!: string;

  @ApiProperty({ example: 'SJC' })
  public symbol!: string;

  @ApiProperty({ example: 'gold' })
  public type!: string;
}

export class PriceDetailSourceDto {
  @ApiProperty({ example: 'vang-today', nullable: true, type: String })
  public code!: string | null;

  @ApiProperty({ example: 'vang.today', nullable: true, type: String })
  public name!: string | null;
}

// All fields nullable: a valid symbol/type with no quotes collected in the
// requested range (e.g. a month before data collection started) still
// returns 200 with everything null, rather than 404 — the range simply has
// no data, which is a normal, chartable ("no line") state, not an error.
export class PriceDetailLatestDto {
  @ApiProperty({ example: 50000, nullable: true, type: Number })
  public buyChange!: number | null;

  @ApiProperty({ example: 7850000, nullable: true, type: Number })
  public buyPrice!: number | null;

  @ApiProperty({ example: '2026-08-17T02:00:00.000Z', nullable: true, type: String })
  public collectedAt!: string | null;

  @ApiProperty({ example: -20000, nullable: true, type: Number })
  public sellChange!: number | null;

  @ApiProperty({ example: 7950000, nullable: true, type: Number })
  public sellPrice!: number | null;

  @ApiProperty({ example: '2026-08-17T02:00:00.000Z', nullable: true, type: String })
  public sourceUpdatedAt!: string | null;
}

export class PriceHistoryPointDto {
  @ApiProperty({ example: 7850000, nullable: true, type: Number })
  public buyPrice!: number | null;

  @ApiProperty({ example: 7950000, nullable: true, type: Number })
  public sellPrice!: number | null;

  // Chart x-axis. For range="today" this is one point per collection run
  // (intraday); for 7d/15d/30d it's deduped to one point per day.
  @ApiProperty({ example: '2026-08-17T02:00:00.000Z' })
  public sourceUpdatedAt!: string;
}

// Derived from the same history[] returned alongside it — always reflects
// whatever `range` was requested, so it never disagrees with the chart.
// open/close are the range's first and last quotes (e.g. day 1 vs day 7 of
// a 7d range) — a summary of the period, not the highest/lowest price seen.
export class PriceDetailStatsDto {
  @ApiProperty({ example: 7800000, nullable: true, type: Number })
  public buyOpen!: number | null;

  @ApiProperty({ example: 7950000, nullable: true, type: Number })
  public buyClose!: number | null;

  // (buyClose - buyOpen) / buyOpen * 100
  @ApiProperty({ example: 1.92, nullable: true, type: Number })
  public buyChangePercent!: number | null;

  @ApiProperty({ example: 7900000, nullable: true, type: Number })
  public sellOpen!: number | null;

  @ApiProperty({ example: 8050000, nullable: true, type: Number })
  public sellClose!: number | null;

  @ApiProperty({ example: -0.63, nullable: true, type: Number })
  public sellChangePercent!: number | null;
}

export class GetPriceDetailResponseDto {
  @ApiProperty({ type: PriceDetailAssetDto })
  public asset!: PriceDetailAssetDto;

  @ApiProperty({ type: [PriceHistoryPointDto] })
  public history!: PriceHistoryPointDto[];

  @ApiProperty({ type: PriceDetailLatestDto })
  public latest!: PriceDetailLatestDto;

  @ApiProperty({ enum: PRICE_DETAIL_RANGE_VALUES })
  public range!: (typeof PRICE_DETAIL_RANGE_VALUES)[number];

  @ApiProperty({ type: PriceDetailSourceDto })
  public source!: PriceDetailSourceDto;

  @ApiProperty({ type: PriceDetailStatsDto })
  public stats!: PriceDetailStatsDto;
}
