import { Controller, Get, Param } from '@nestjs/common';

import { FeedManager } from 'src/application/feed.service';
import { UserManager } from 'src/application/user.service';

@Controller()
export class RssController {
  constructor(
    private readonly feed: FeedManager,
    private readonly users: UserManager,
  ) {}

  @Get('feed/:userId')
  async rss(@Param('userId') userId: string) {
    const user = await this.users.getUser(userId);
    const items = await this.feed.getFeed(user);

    console.log(items);
  }
}
