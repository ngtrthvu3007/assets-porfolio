import { Module } from '@nestjs/common';
import { PricesController } from './prices.controller';
import { PricesRepository } from './prices.repository';
import { PricesService } from './prices.service';

@Module({
  controllers: [PricesController],
  providers: [PricesRepository, PricesService],
})
export class PricesModule {}
