import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api'); //글로벌 프리픽스 설정
  await app.listen(3000);
}
bootstrap();
