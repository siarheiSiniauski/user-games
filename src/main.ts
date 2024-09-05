import { NestFactory } from '@nestjs/core';
import * as dotenv from 'dotenv';

import { AppModule } from './app.module';
import { getConfigCors } from './configs/cors.config';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Включение CORS с глобальными настройками
  app.enableCors(getConfigCors());

  await app.listen(process.env.PORT || 5002);
}
bootstrap();
