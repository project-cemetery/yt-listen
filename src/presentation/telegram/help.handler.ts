import { Injectable } from '@nestjs/common';
import { Context, TelegramActionHandler } from 'nest-telegram';

import { FeedManager } from 'src/application/feed.service';
import { UserManager } from 'src/application/user.service';
import { User } from 'src/entity/user.entity';

@Injectable()
export class HelpHandler {
  constructor(
    private readonly feed: FeedManager,
    private readonly users: UserManager,
  ) {}

  @TelegramActionHandler({ onStart: true })
  async start(ctx: Context) {
    const user = await this.users.resolveTelegramUser(ctx.from?.id);
    const help = await this.getHelp(user);
    const message = this.formatMessage(["I'm YT Listen bot 👋", ...help]);

    await ctx.reply(message, {
      parse_mode: 'Markdown',
      disable_web_page_preview: true,
    });
  }

  @TelegramActionHandler({ command: '/help' })
  async help(ctx: Context) {
    const user = await this.users.resolveTelegramUser(ctx.from?.id);
    const help = await this.getHelp(user);
    const message = this.formatMessage(help);

    await ctx.reply(message, {
      parse_mode: 'Markdown',
      disable_web_page_preview: true,
    });
  }

  private async getHelp(user: User) {
    const feedLink = await this.feed.getFeedLink(user);

    return [
      "Send me any YouTube-video, and I'll create a personal RSS feed for you, download the video, convert it to audio and put in the feed.",
      `Personal RSS-feed can be used in any podcast-application ([Apple Podcasts](https://support.patreon.com/hc/en-us/articles/115000877506-Add-my-private-RSS-feed-to-the-Apple-Podcast-app), [Pocket Casts](pktc://subscribe/${feedLink}), Overcast, etc.).`,
    ];
  }

  private formatMessage(message: string[]): string {
    return message.join('\n\n');
  }
}
