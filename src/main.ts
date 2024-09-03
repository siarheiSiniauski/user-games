import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { getConfigCors } from './configs/cors.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Включение CORS с глобальными настройками
  app.enableCors(getConfigCors());

  await app.listen(3000);
}
bootstrap();
