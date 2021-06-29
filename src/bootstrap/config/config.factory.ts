import { Provider } from '@nestjs/common';
import { CommonConfiguration } from '@solid-soda/config';
import { resolve } from 'path';

import { Configuration } from './config';

export default class ConfigurationFactory {
  public static create(): Configuration {
    return new CommonConfiguration(resolve(__dirname, '../../../.env'));
  }

  public static provider(): Provider {
    return {
      provide: Configuration,
      useValue: ConfigurationFactory.create(),
    };
  }
}
