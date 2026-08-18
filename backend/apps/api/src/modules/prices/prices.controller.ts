import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import {
  ListLatestPricesQueryDto,
  ListPricesQueryDto,
} from './dto/list-prices-query.dto';
import {
  ListLatestPricesResponseDto,
  ListPricesResponseDto,
} from './dto/list-prices-response.dto';
import { PricesService } from './prices.service';

@ApiTags('Prices')
@Controller('api/prices')
export class PricesController {
  public constructor(private readonly pricesService: PricesService) {}

  @Get()
  @ApiOkResponse({ type: ListPricesResponseDto })
  public getPricesController(@Query() query: ListPricesQueryDto) {
    return this.pricesService.listPricesService(query);
  }

  @Get('latest')
  @ApiOkResponse({ type: ListLatestPricesResponseDto })
  public getLatestPricesController(@Query() query: ListLatestPricesQueryDto) {
    return this.pricesService.listLatestPricesService(query);
  }

  @Get('types')
  public getPriceTypesController() {
    return this.pricesService.listPriceTypesService();
  }

  @Get(':type/:symbol')
  public getPriceDetailController(
    @Param('type') type: string,
    @Param('symbol') symbol: string,
    @Query('days') days?: string,
  ) {
    return this.pricesService.getPriceDetailService({ days, symbol, type });
  }
}
