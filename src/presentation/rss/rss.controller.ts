import { Controller, Get, Header, Param } from '@nestjs/common';
// @ts-ignore
import Podcast from 'podcast';

import { FeedManager } from 'src/application/feed.service';
import { UserManager } from 'src/application/user.service';
import { Configuration } from 'src/bootstrap/config/config';

@Controller()
export class RssController {
  constructor(
    private readonly feed: FeedManager,
    private readonly users: UserManager,
    private readonly config: Configuration,
  ) {}

  @Get('rss/:userId')
  @Header('Content-Type', 'application/rss+xml; charset=utf-8')
  async rss(@Param('userId') userId: string) {
    const user = await this.users.getUser(userId);
    const items = await this.feed.getFeed(user);
    const url = await this.feed.getFeedUrl(user);

    const feed = new Podcast({
      title: 'YT Listen',
      description: 'Personal feed in YT Listen',
      feedUrl: url,
      siteUrl: `https://${this.config.getStringOrThrow('PUBLIC_URL')}`,
      author: 'YT Listen',
    });

    items.forEach((item) => {
      feed.addItem({
        title: item.title,
        guid: item.id,
        url: item.originalUrl,
        description: item.description,
        author: item.author,
        date: item.createdAt,
        enclosure: {
          url: item.url,
        },
      });
    });

    return feed.buildXml('  ');
  }
}
