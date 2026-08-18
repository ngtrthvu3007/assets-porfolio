import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ListPricesQueryDto } from './dto/list-prices-query.dto';
import { PricesService } from './prices.service';

@ApiTags('Prices')
@Controller('api/prices')
export class PricesController {
  public constructor(private readonly pricesService: PricesService) {}

  @Get()
  public getPricesController(@Query() query: ListPricesQueryDto) {
    return this.pricesService.listPricesService(query);
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
