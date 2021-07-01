import { Injectable } from '@nestjs/common';
import { Context, TelegramActionHandler } from 'nest-telegram';

import { Analyst } from 'src/application/analyst.service';
import { FeedManager } from 'src/application/feed.service';
import { UserManager } from 'src/application/user.service';

@Injectable()
export class VideoHandler {
  constructor(
    private readonly users: UserManager,
    private readonly feed: FeedManager,
    private readonly analyst: Analyst,
  ) {}

  @TelegramActionHandler({ message: new RegExp('https://', 'gi') })
  async video(ctx: Context) {
    const msg = ctx.message?.text;
    const url = msg?.match(/https:\/\/\S+/i)?.[0];
    const telegramId = ctx.from?.id;

    if (!url || !telegramId) {
      throw new Error('Something wrong');
    }

    const user = await this.users.resolveTelegramUser(telegramId);

    await this.analyst.logEvent(user, 'video_processing_start', { url });

    await ctx.reply(`Please, wait a minute...`);

    // TODO: make queue???

    try {
      await this.feed.addVideoToFeed(url, user);

      await this.analyst.logEvent(user, 'video_processing_done', { url });

      await ctx.reply('Done! Your private been has been updated 🤗');
    } catch (e) {
      console.error(e);
      await this.analyst.logEvent(user, 'video_processing_fail', {
        url,
        error: e.message,
      });
      await ctx.reply('Something went wrong, sorry 😭');
    }
  }
}
