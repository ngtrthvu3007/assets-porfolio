import { Module } from '@nestjs/common';
import { ChartsService } from './charts.service';

@Module({
  exports: [ChartsService],
  providers: [ChartsService],
})
export class ChartsModule {}
