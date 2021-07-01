import { Context, TelegramCatch, TelegramErrorHandler } from 'nest-telegram';

import { IlligalActionError } from 'src/application/illegal_action.error';

@TelegramCatch(IlligalActionError)
export class IlligalActionCatcher
  implements TelegramErrorHandler<IlligalActionError>
{
  async catch(ctx: Context, exception: IlligalActionError) {
    // TODO: change it after payment feature
    await ctx.reply(exception.message);
  }
}
