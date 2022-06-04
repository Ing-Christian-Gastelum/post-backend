import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { config } from 'dotenv';

config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({ origin: '*' });
  app.setGlobalPrefix('/api/v1');
  app.useGlobalPipes(new ValidationPipe());

  await app.listen(Number.parseInt(process.env.PORT));
}
bootstrap();
