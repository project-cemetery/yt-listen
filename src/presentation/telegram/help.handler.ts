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
    const defaultHelp = this.getDefaultHelp();
    const message = this.formatMessage([
      "I'm YT Listen bot 👋",
      ...defaultHelp,
      'Use /help for more info',
    ]);

    await ctx.reply(message, {
      parse_mode: 'Markdown',
      disable_web_page_preview: true,
    });
  }

  @TelegramActionHandler({ command: '/help' })
  async help(ctx: Context) {
    const defaulthelp = this.getDefaultHelp();
    const message = this.formatMessage([
      ...defaulthelp,
      'To find out how to add a private feed to your favorite podcast app, click the button below 👇',
    ]);

    await ctx.reply(message, {
      parse_mode: 'Markdown',
      disable_web_page_preview: true,
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: 'Apple Podcasts',
              url: 'https://www.imore.com/how-manually-add-podcasts-apple-podcasts#podcasts',
            },
          ],
          [
            {
              text: 'Overcast',
              url: 'https://www.imore.com/how-manually-add-podcasts-apple-podcasts#overcast',
            },
            {
              text: 'Pocket Casts',
              url: 'https://www.imore.com/how-manually-add-podcasts-apple-podcasts#pocketcasts',
            },
          ],
          [
            {
              text: 'Castro',
              url: 'https://www.imore.com/how-manually-add-podcasts-apple-podcasts#castro',
            },
            {
              text: 'Google Podcasts',
              url: 'https://twitter.com/GabeBender/status/1334593474688126979',
            },
          ],
        ],
      },
    });
  }

  private getDefaultHelp() {
    return [
      "Send me any YouTube-video, and I'll create a personal RSS feed for you, download the video, convert it to audio and put in the feed.",
    ];
  }

  private formatMessage(message: string[]): string {
    return message.join('\n\n');
  }
}
