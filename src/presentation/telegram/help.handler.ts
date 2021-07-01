import { Injectable } from '@nestjs/common';
import { Context, TelegramActionHandler } from 'nest-telegram';

import { Analyst } from 'src/application/analyst.service';
import { FeedManager } from 'src/application/feed.service';
import { UserManager } from 'src/application/user.service';
import { User } from 'src/entity/user.entity';

@Injectable()
export class HelpHandler {
  constructor(
    private readonly feed: FeedManager,
    private readonly users: UserManager,
    private readonly analyst: Analyst,
  ) {}

  @TelegramActionHandler({ onStart: true })
  async start(ctx: Context) {
    const user = await this.users.resolveTelegramUser(ctx.from?.id);

    await this.analyst.logEvent(user, 'bot_started');

    await ctx.reply(
      this.formatMessage([
        "I'm YT Listen bot 👋",
        'I provide simple way to listen any YouTube-video in podcast-app as a regular podcast.',
      ]),
    );
    await this.sendHelp(user, ctx, { shouldPin: true });
  }

  @TelegramActionHandler({ command: '/help' })
  async help(ctx: Context) {
    const user = await this.users.resolveTelegramUser(ctx.from?.id);

    await this.analyst.logEvent(user, 'bot_help_requested');

    await this.sendHelp(user, ctx, { shouldPin: false });
  }

  async sendHelp(
    user: User,
    ctx: Context,
    { shouldPin }: { shouldPin: boolean },
  ) {
    const feedUrl = await this.feed.getFeedUrl(user);

    await ctx.replyWithMarkdown(
      this.formatMessage([
        "Send me any YouTube-video, and I'll create a personal RSS feed for you, download the video, convert it to audio and put in the feed.",
        'Your private RSS link 👇',
      ]),
    );

    const feedSentMessage = await ctx.replyWithMarkdown(`\`${feedUrl}\``);
    if (shouldPin) {
      await ctx.pinChatMessage(feedSentMessage.message_id, {
        disable_notification: true,
      });
    }

    await ctx.replyWithMarkdown(
      'To find out how to add a private feed to your favorite podcast app, click the button below 👇',
      {
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
      },
    );
  }

  private formatMessage(message: string[]): string {
    return message.join('\n\n');
  }
}
