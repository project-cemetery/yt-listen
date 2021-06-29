import { NestFactory } from '@nestjs/core';
import { TelegramBot } from 'nest-telegram';
import { AppModule } from './app.module';
import { Configuration } from './bootstrap/config/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = app.get(Configuration);

  if (config.isProd()) {
    const bot = app.get(TelegramBot);
    app.use(bot.getMiddleware('hook-path'));
  }

  await app.listen(3000);
}
bootstrap();
