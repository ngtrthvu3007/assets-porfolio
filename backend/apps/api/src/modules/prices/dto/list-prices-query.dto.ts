import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class ListPricesQueryDto {
  @ApiProperty({ example: 'gold' })
  @IsNotEmpty()
  @IsString()
  public type!: string;

  @ApiPropertyOptional({ example: 'market-data-provider' })
  @IsOptional()
  @IsString()
  public source?: string;

  @ApiPropertyOptional({ example: 'SJC' })
  @IsOptional()
  @IsString()
  public q?: string;

  @ApiPropertyOptional({ default: 1 })
  @IsOptional()
  @IsString()
  public page?: string;

  @ApiPropertyOptional({ default: 50 })
  @IsOptional()
  @IsString()
  public pageSize?: string;

  @ApiPropertyOptional({
    default: 'updatedAt',
    enum: ['symbol', 'name', 'updatedAt', 'buyPrice', 'sellPrice'],
  })
  @IsOptional()
  @IsString()
  public sort?: string;

  @ApiPropertyOptional({ default: 'desc', enum: ['asc', 'desc'] })
  @IsOptional()
  @IsString()
  public order?: string;
}
