import { NestFactory } from '@nestjs/core';
import { CollectorModule } from './collector.module';

async function bootstrap() {
  await NestFactory.createApplicationContext(CollectorModule);
}
bootstrap();
