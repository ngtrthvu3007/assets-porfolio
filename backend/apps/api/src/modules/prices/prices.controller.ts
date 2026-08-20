import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import {
  GetPriceDetailQueryDto,
  ListPricesQueryDto,
} from './dto/list-prices-query.dto';
import {
  GetPriceDetailResponseDto,
  ListPricesResponseDto,
  ListPriceTypesResponseDto,
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
  @ApiOkResponse({ type: ListPricesResponseDto })
  public getLatestPricesController(@Query() query: ListPricesQueryDto) {
    return this.pricesService.listLatestPricesService(query);
  }

  @Get('types')
  @ApiOkResponse({ type: ListPriceTypesResponseDto })
  public getPriceTypesController() {
    return this.pricesService.listPriceTypesService();
  }

  @Get(':type/:symbol')
  @ApiOkResponse({ type: GetPriceDetailResponseDto })
  public getPriceDetailController(
    @Param('type') type: string,
    @Param('symbol') symbol: string,
    @Query() query: GetPriceDetailQueryDto,
  ) {
    return this.pricesService.getPriceDetailService({
      range: query.range,
      symbol,
      type,
    });
  }
}
