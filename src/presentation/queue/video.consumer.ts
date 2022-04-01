import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { TelegramBot } from 'nest-telegram';

import { Analyst } from 'src/application/analyst.service';
import { FeedManager } from 'src/application/feed.service';
import { UserManager } from 'src/application/user.service';

import { VIDEO_QUEUE } from '../constants/queue';
import { VideoRequest } from '../dto/video_request.dto';

@Processor(VIDEO_QUEUE)
export class VideoConsumer {
  constructor(
    private readonly users: UserManager,
    private readonly feed: FeedManager,
    private readonly analyst: Analyst,
    private readonly bot: TelegramBot,
  ) {}

  @Process()
  async handleVideo(job: Job<VideoRequest>) {
    const { url, userId } = job.data;

    const user = await this.users.getUser(userId);

    try {
      await this.feed.addVideoToFeed(url, user);

      await this.analyst.logEvent(user, 'video_processing_done', { url });

      await this.bot.telegrafBot.telegram.sendMessage(
        user.telegramId,
        'Done! Your private feed has been updated 🤗',
      );
    } catch (e) {
      console.error(e);

      await this.analyst.logEvent(user, 'video_processing_fail', {
        url,
        error: (e as any).message,
      });

      await this.bot.telegrafBot.telegram.sendMessage(
        user.telegramId,
        'Something went wrong, sorry 😭',
      );
    }
  }
}
