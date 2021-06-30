import { Injectable } from '@nestjs/common';
import { Context, TelegramActionHandler } from 'nest-telegram';

@Injectable()
export class HelpHandler {
  private HELP = [
    "Send me any YouTube-video, and I'll create a personal RSS feed for you, download the video, convert it to audio and put in the feed.",
    'Personal RSS-feed can be used in any podcast-application ([Apple Podcasts](https://support.patreon.com/hc/en-us/articles/115000877506-Add-my-private-RSS-feed-to-the-Apple-Podcast-app), Pocket Casts, Overcast, etc.).',
  ];

  @TelegramActionHandler({ onStart: true })
  async start(ctx: Context) {
    const message = this.formatMessage(["I'm YT Listen bot 👋", ...this.HELP]);

    await ctx.reply(message, { parse_mode: 'Markdown' });
  }

  @TelegramActionHandler({ command: '/help' })
  async help(ctx: Context) {
    const message = this.formatMessage(this.HELP);

    await ctx.reply(message, { parse_mode: 'Markdown' });
  }

  private formatMessage(message: string[]): string {
    return message.join('\n\n');
  }
}
