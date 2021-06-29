import { Module } from '@nestjs/common';

import ConfigurationFactory from './config.factory';

const configProvider = ConfigurationFactory.provider();

@Module({
  providers: [configProvider],
  exports: [configProvider],
})
export class ConfigModule {}
