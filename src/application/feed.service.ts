import { Injectable } from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import crypto from 'crypto';

import { Configuration } from 'src/bootstrap/config/config';
import { FeedItem } from 'src/entity/feed_item.entity';
import { User } from 'src/entity/user.entity';

import { AudioDownloader } from './audio_downloader.service';
import { FileUploader } from './file_uploader.service';

@Injectable()
export class FeedManager {
  private readonly siteUrl: string;

  constructor(
    private readonly downloader: AudioDownloader,
    private readonly uploader: FileUploader,
    @InjectEntityManager()
    private readonly em: EntityManager,
    @InjectRepository(FeedItem)
    private readonly repo: Repository<FeedItem>,
    config: Configuration,
  ) {
    this.siteUrl = config.getStringOrThrow('PUBLIC_URL');
  }

  async addVideoToFeed(videoUrl: string, user: User): Promise<void> {
    const name = this.generateVideoName(videoUrl);

    const existItem = await this.resolveByHash(name);

    let feedItem: FeedItem;

    if (existItem) {
      feedItem = FeedItem.copyToOtherOwner(existItem, user);
    } else {
      const downloaded = await this.downloader.downloadAudios(videoUrl);
      const uploadedUrl = await this.uploader.upload(downloaded.buffer, name);

      feedItem = FeedItem.new({
        hash: name,
        url: uploadedUrl,
        title: downloaded.title,
        description: downloaded.description,
        author: downloaded.author,
        originalUrl: videoUrl,
        owner: user,
      });
    }

    await this.em.save(feedItem);
  }

  async getFeedUrl(user: User): Promise<string> {
    return `https://${this.siteUrl}/rss/${user.id}`;
  }

  async getFeed(user: User): Promise<Array<FeedItem>> {
    return this.repo.find({ owner: user });
  }

  private resolveByHash(hash: string): Promise<FeedItem | undefined> {
    return this.repo.findOne({ hash });
  }

  private generateVideoName(url: string): string {
    const hash = crypto.createHash('sha256');
    hash.update(url);
    const filename = hash.digest('hex').slice(0, 20);

    return `${filename}.mp3`;
  }
}
