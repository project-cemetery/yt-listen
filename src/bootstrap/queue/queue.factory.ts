import { SharedBullConfigurationFactory } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { QueueOptions } from 'bull';
import { Configuration } from '../config/config';

@Injectable()
export class QueueOptionsFactory implements SharedBullConfigurationFactory {
  constructor(private readonly config: Configuration) {}

  createSharedConfiguration(): QueueOptions {
    const host = this.config.getStringOrThrow('REDIS_HOST');
    const port = this.config.getNumberOrThrow('REDIS_PORT');

    const username = this.config.getStringOrElse('REDIS_USER', '');
    const password = this.config.getStringOrElse('REDIS_PASSWORD', '');

    return { redis: { host, port, username, password } };
  }
}
