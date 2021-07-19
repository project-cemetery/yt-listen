import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { ServeStaticModule } from '@nestjs/serve-static';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bull';
import { TelegramBot, TelegramModule } from 'nest-telegram';
import { join } from 'path';

import { Analyst } from './application/analyst.service';
import { AudioDownloader } from './application/audio_downloader.service';
import { FeedManager } from './application/feed.service';
import { FileUploader } from './application/file_uploader.service';
import { UrlClassifier } from './application/url_classifier.service';
import { UserManager } from './application/user.service';
import { ConfigModule } from './bootstrap/config/config.module';
import { DbOptionsFactory } from './bootstrap/db/db_options.factory';
import { TelegramOptionsFactory } from './bootstrap/telegram/telegram_options.factory';
import { FeedItem } from './entity/feed_item.entity';
import { User } from './entity/user.entity';
import { DigitalOceanSpacesUploader } from './infrastrcture/do_spaces.service';
import { YouTubeDownloader } from './infrastrcture/youtube_downloader.service';
import { RssController } from './presentation/rss/rss.controller';
import { BadRequestCatcher } from './presentation/telegram/bad_request.catcher';
import { HelpHandler } from './presentation/telegram/help.handler';
import { IlligalActionCatcher } from './presentation/telegram/illegal_action.catcher';
import { NotFoundCatcher } from './presentation/telegram/not_found.catcher';
import { VideoHandler } from './presentation/telegram/video.handler';
import { QueueOptionsFactory } from './bootstrap/queue/queue.factory';
import { VIDEO_QUEUE } from './presentation/constants/queue';
import { VideoConsumer } from './presentation/queue/video.consumer';
import { HealthController } from './presentation/health/health.controller';

@Module({
  imports: [
    ConfigModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'static'),
      serveRoot: '/static',
    }),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useClass: QueueOptionsFactory,
    }),
    BullModule.registerQueue({
      name: VIDEO_QUEUE,
    }),
    TelegramModule.forRootAsync({
      imports: [ConfigModule],
      useClass: TelegramOptionsFactory,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useClass: DbOptionsFactory,
    }),
    TypeOrmModule.forFeature([FeedItem]),
    TypeOrmModule.forFeature([User]),
  ],
  controllers: [RssController, HealthController],
  providers: [
    HelpHandler,
    VideoHandler,
    FeedManager,
    UserManager,
    Analyst,
    UrlClassifier,
    BadRequestCatcher,
    NotFoundCatcher,
    IlligalActionCatcher,
    VideoConsumer,
    { provide: FileUploader, useClass: DigitalOceanSpacesUploader },
    { provide: AudioDownloader, useClass: YouTubeDownloader },
  ],
})
export class AppModule implements NestModule {
  constructor(
    private readonly moduleRef: ModuleRef,
    private readonly telegramBot: TelegramBot,
  ) {}

  configure(consumer: MiddlewareConsumer) {
    this.telegramBot.init(this.moduleRef);
  }
}
