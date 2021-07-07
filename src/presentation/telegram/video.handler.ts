import { InjectQueue } from '@nestjs/bull';
import { BadRequestException, Injectable } from '@nestjs/common';
import { Queue } from 'bull';
import { Context, TelegramActionHandler } from 'nest-telegram';

import { Analyst } from 'src/application/analyst.service';
import { FeedManager } from 'src/application/feed.service';
import { IlligalActionError } from 'src/application/illegal_action.error';
import { UrlClassifier } from 'src/application/url_classifier.service';
import { UserManager } from 'src/application/user.service';
import { VIDEO_QUEUE } from '../constants/queue';
import { VideoRequest } from '../dto/video_request.dto';

@Injectable()
export class VideoHandler {
  constructor(
    private readonly users: UserManager,
    private readonly feed: FeedManager,
    private readonly analyst: Analyst,
    private readonly urls: UrlClassifier,
    @InjectQueue(VIDEO_QUEUE)
    private readonly videoQueue: Queue<VideoRequest>,
  ) {}

  @TelegramActionHandler({ message: new RegExp('https://', 'gi') })
  async video(ctx: Context) {
    const url = this.urls.extract(ctx.message?.text);

    if (!url) {
      throw new BadRequestException('I can not find url in this message');
    }

    const urlType = this.urls.whatIsIt(url);

    const user = await this.users.resolveTelegramUser(ctx.from?.id);

    const canUserDoThisAction = await this.users.canUse(user, urlType);
    if (!canUserDoThisAction) {
      throw new IlligalActionError(url, urlType);
    }

    await this.analyst.logEvent(user, 'video_processing_start', {
      url,
      message: ctx.message?.text ?? '',
    });

    await this.videoQueue.add({ userId: user.id, url });

    await ctx.reply(`Please, wait a minute...`);
  }
}
