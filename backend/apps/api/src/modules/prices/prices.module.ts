import { Module } from '@nestjs/common';
import { ChartsModule } from '../charts/charts.module';
import { PricesController } from './prices.controller';
import { PricesRepository } from './prices.repository';
import { PricesService } from './prices.service';

@Module({
  controllers: [PricesController],
  imports: [ChartsModule],
  providers: [PricesRepository, PricesService],
})
export class PricesModule {}
