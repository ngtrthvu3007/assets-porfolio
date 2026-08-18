import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  DEFAULT_SORT_ORDER,
  PaginationQueryDto,
  PRICE_LIST_SORT_VALUES,
  SORT_ORDER_VALUES,
} from '@shared';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

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
