import * as Amplitude from '@amplitude/node';
import { Injectable } from '@nestjs/common';

import { Configuration } from 'src/bootstrap/config/config';
import { User } from 'src/entity/user.entity';

@Injectable()
export class Analyst {
  private readonly analytics: Amplitude.NodeClient;

  constructor(config: Configuration) {
    this.analytics = Amplitude.init(config.getStringOrThrow('AMPLITUDE_KEY'));
  }

  async logEvent(
    user: User,
    eventType: string,
    props: Record<string, number | string | boolean> = {},
  ) {
    await this.analytics.logEvent({
      event_type: eventType,
      user_id: user.id,
      event_properties: props,
    });
  }
}
