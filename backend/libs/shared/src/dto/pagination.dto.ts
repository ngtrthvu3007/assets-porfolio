import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from '../constants/pagination';

export class PaginationQueryDto {
  @ApiPropertyOptional({ default: DEFAULT_PAGE })
  @IsOptional()
  @IsString()
  public page?: string;

  @ApiPropertyOptional({ default: DEFAULT_PAGE_SIZE })
  @IsOptional()
  @IsString()
  public pageSize?: string;
}

export class PaginationResponseDto {
  @ApiProperty({ example: 1 })
  public page!: number;

  @ApiProperty({ example: 20 })
  public pageSize!: number;

  @ApiProperty({ example: 120 })
  public total!: number;

  @ApiProperty({ example: 6 })
  public totalPages!: number;
}
