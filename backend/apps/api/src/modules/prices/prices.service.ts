import { Injectable, NotImplementedException } from '@nestjs/common';
import { ListPricesQueryDto } from './dto/list-prices-query.dto';

interface GetPriceDetailInput {
  days?: string;
  symbol: string;
  type: string;
}

@Injectable()
export class PricesService {
  public listPricesService(_query: ListPricesQueryDto) {
    throw new NotImplementedException('Prices API is not ready yet');
  }

  public listPriceTypesService() {
    throw new NotImplementedException('Price types API is not ready yet');
  }

  public getPriceDetailService(_input: GetPriceDetailInput) {
    throw new NotImplementedException('Price detail API is not ready yet');
  }
}
