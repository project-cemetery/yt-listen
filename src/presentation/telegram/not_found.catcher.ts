import { NotFoundException } from '@nestjs/common';
import { Context, TelegramCatch, TelegramErrorHandler } from 'nest-telegram';

@TelegramCatch(NotFoundException)
export class NotFoundCatcher
  implements TelegramErrorHandler<NotFoundException>
{
  async catch(ctx: Context, exception: NotFoundException) {
    await ctx.reply(exception.message);
  }
}
