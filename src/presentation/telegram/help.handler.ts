import { Injectable } from '@nestjs/common';
import { Context, TelegramActionHandler } from 'nest-telegram';

@Injectable()
export class HelpHandler {
  @TelegramActionHandler({ onStart: true })
  async start(ctx: Context) {
    await ctx.reply('Hello!');
  }

  @TelegramActionHandler({ command: '/help' })
  async help(ctx: Context) {
    await ctx.reply('Help!');
  }
}
