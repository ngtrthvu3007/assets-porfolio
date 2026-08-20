import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  DEFAULT_PRICE_DETAIL_RANGE,
  DEFAULT_SORT_ORDER,
  PaginationQueryDto,
  PRICE_DETAIL_RANGE_VALUES,
  PRICE_LIST_SORT_VALUES,
  SORT_ORDER_VALUES,
} from '@shared';
import {
  IsDateString,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateIf,
} from 'class-validator';

export class ListPricesQueryDto extends PaginationQueryDto {
  @ApiProperty({ example: 'gold' })
  @IsNotEmpty()
  @IsString()
  public type!: string;

  @ApiPropertyOptional({ example: 'SJC' })
  @IsOptional()
  @IsString()
  public q?: string;

  @ApiPropertyOptional({
    default: 'sourceUpdatedAt',
    enum: PRICE_LIST_SORT_VALUES,
  })
  @IsOptional()
  @IsString()
  public sort?: string;

  @ApiPropertyOptional({ default: DEFAULT_SORT_ORDER, enum: SORT_ORDER_VALUES })
  @IsOptional()
  @IsString()
  public order?: string;
}

export class ListLatestPricesQueryDto {
  @ApiProperty({ example: 'gold' })
  @IsNotEmpty()
  @IsString()
  public type!: string;
}

export class GetPriceDetailQueryDto {
  @ApiPropertyOptional({
    default: DEFAULT_PRICE_DETAIL_RANGE,
    enum: PRICE_DETAIL_RANGE_VALUES,
  })
  @IsOptional()
  @IsIn(PRICE_DETAIL_RANGE_VALUES)
  public range?: (typeof PRICE_DETAIL_RANGE_VALUES)[number];

  // Required only when range="custom" — ignored for every other range.
  @ApiPropertyOptional({ example: '2026-08-01' })
  @ValidateIf((dto: GetPriceDetailQueryDto) => dto.range === 'custom')
  @IsNotEmpty()
  @IsDateString()
  public startDate?: string;

  @ApiPropertyOptional({ example: '2026-08-15' })
  @ValidateIf((dto: GetPriceDetailQueryDto) => dto.range === 'custom')
  @IsNotEmpty()
  @IsDateString()
  public endDate?: string;
}
