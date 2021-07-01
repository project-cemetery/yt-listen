import { Controller, Get, Header, Param } from '@nestjs/common';
// @ts-ignore
import Podcast from 'podcast';
import { Analyst } from 'src/application/analyst.service';

import { FeedManager } from 'src/application/feed.service';
import { UserManager } from 'src/application/user.service';
import { Configuration } from 'src/bootstrap/config/config';

@Controller()
export class RssController {
  constructor(
    private readonly feed: FeedManager,
    private readonly users: UserManager,
    private readonly config: Configuration,
    private readonly analyst: Analyst,
  ) {}

  @Get('rss/:userId')
  @Header('Content-Type', 'application/rss+xml; charset=utf-8')
  async rss(@Param('userId') userId: string) {
    const user = await this.users.getUser(userId);
    await this.analyst.logEvent(user, 'rss_requested');

    const items = await this.feed.getFeed(user);
    const url = await this.feed.getFeedUrl(user);

    const siteUrl = `https://${this.config.getStringOrThrow('PUBLIC_URL')}`;

    const feed = new Podcast({
      title: 'YT Listen',
      description: 'Personal feed in YT Listen',
      feedUrl: url,
      siteUrl,
      author: 'YT Listen',
      imageUrl: `${siteUrl}/static/feed_cover.jpeg`,
      ttl: 5,
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
