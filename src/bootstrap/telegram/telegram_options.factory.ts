import { Injectable } from '@nestjs/common';
import {
  TelegramModuleOptions,
  TelegramModuleOptionsFactory,
} from 'nest-telegram';
import { Configuration } from '../config/config';

@Injectable()
export class TelegramOptionsFactory implements TelegramModuleOptionsFactory {
  constructor(private readonly config: Configuration) {}

  createOptions(): TelegramModuleOptions {
    return {
      token: this.config.getStringOrThrow('TELEGRAM_TOKEN'),
      sitePublicUrl: `https://${this.config.getStringOrThrow('PUBLIC_URL')}`,
      usePolling: this.config.isDev(),
    };
  }
}
