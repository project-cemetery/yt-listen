import { BadRequestException } from '@nestjs/common';
import { Context, TelegramCatch, TelegramErrorHandler } from 'nest-telegram';

@TelegramCatch(BadRequestException)
export class BadRequestCatcher
  implements TelegramErrorHandler<BadRequestException>
{
  async catch(ctx: Context, exception: BadRequestException) {
    await ctx.reply(exception.message);
  }
}
