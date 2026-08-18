import { ApiProperty } from '@nestjs/swagger';
import { PaginationResponseDto } from '@shared';

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
