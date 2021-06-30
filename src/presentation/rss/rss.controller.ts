import { Controller, Get, Header, Param } from '@nestjs/common';
import { Feed } from 'feed';

import { FeedManager } from 'src/application/feed.service';
import { UserManager } from 'src/application/user.service';

@Controller()
export class RssController {
  constructor(
    private readonly feed: FeedManager,
    private readonly users: UserManager,
  ) {}

  @Get('rss/:userId')
  @Header('Content-Type', 'application/rss+xml; charset=utf-8')
  async rss(@Param('userId') userId: string) {
    const user = await this.users.getUser(userId);
    const items = await this.feed.getFeed(user);
    const url = await this.feed.getFeedUrl(user);

    const feed = new Feed({
      title: 'YT Listen',
      description: 'Personal feed in YT Listen',
      id: userId,
      copyright: 'F Society',
      generator: 'YT Listen',
      feedLinks: {
        rss: url,
      },
    });

    items.forEach((item) => {
      feed.addItem({
        title: item.title,
        id: item.id,
        link: item.url,
        description: item.description,
        author: [
          {
            name: item.author,
          },
        ],
        date: item.createdAt,
      });
    });

    return feed.rss2();
  }
}
