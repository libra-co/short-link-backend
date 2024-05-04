import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.setGlobalPrefix('api', {
    exclude: ['/direct/:shortCode'], // Exclude the route with the shortCode parameter
  });
  await app.listen(3009);
}
bootstrap();
