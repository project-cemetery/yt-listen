import { Injectable } from '@nestjs/common';
import { Context, TelegramActionHandler } from 'nest-telegram';

import { FeedManager } from 'src/application/feed.service';
import { UserManager } from 'src/application/user.service';

@Injectable()
export class VideoHandler {
  constructor(
    private readonly users: UserManager,
    private readonly feed: FeedManager,
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

    await ctx.reply(`Please, wait a minute...`);

    // TODO: make queue???

    try {
      await this.feed.addVideoToFeed(url, user);

      await ctx.reply('Done! Your private been has been updated 🤗');
    } catch (e) {
      console.error(e);
      await ctx.reply('Something went wrong, sorry 😭');
    }
  }
}
