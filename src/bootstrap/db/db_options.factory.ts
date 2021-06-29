import { Inject } from '@nestjs/common';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { join } from 'path';

import { Configuration } from '../config/config';

export class DbOptionsFactory implements TypeOrmOptionsFactory {
  public constructor(private readonly config: Configuration) {}

  public createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: 'postgres',
      host: this.config.getStringOrThrow('DB_HOST'),
      port: this.config.getNumberOrThrow('DB_PORT'),
      username: this.config.getStringOrThrow('DB_USER'),
      password: this.config.getStringOrThrow('DB_PASSWORD'),
      database: this.config.getStringOrThrow('DB_NAME'),
      entities: [join(__dirname, '../../**/*.{entity}.{ts,js}')],
      synchronize: false,
      autoLoadEntities: true,
      ssl: this.config.isProd()
        ? ({
            require: true,
            rejectUnauthorized: false,
          } as any)
        : undefined,
    };
  }
}
