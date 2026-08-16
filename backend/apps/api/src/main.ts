import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { ApiModule } from './api.module';
import { DEFAULT_CLIENT_ORIGIN, DEFAULT_PORT } from '@shared/constants/env';
import { parseNumberEnv } from '@shared/utils/env.util';

async function bootstrap() {
  const app = await NestFactory.create(ApiModule);

  app.enableCors({
    origin: process.env.CLIENT_ORIGIN ?? DEFAULT_CLIENT_ORIGIN,
  });
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Assets Portfolio API')
    .setVersion('0.1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api/docs', app, document);

  await app.listen(parseNumberEnv(process.env.PORT, DEFAULT_PORT));
}
bootstrap();
