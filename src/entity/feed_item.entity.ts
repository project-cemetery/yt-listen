import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { uid } from 'uid';

import { User } from './user.entity';

@Entity('feed_item')
export class FeedItem {
  @PrimaryColumn()
  readonly id: string;

  @Column()
  readonly hash: string;

  @Column()
  readonly url: string;

  @Column()
  readonly title: string;

  @Column()
  readonly author: string;

  @Column()
  readonly description: string;

  @ManyToOne((type) => User)
  readonly owner?: User;

  @Column()
  readonly createdAt: Date;

  constructor(
    id: string,
    hash: string,
    url: string,
    title: string,
    author: string,
    description: string,
    owner: User,
    createdAt: Date,
  ) {
    this.id = id;
    this.hash = hash;
    this.url = url;
    this.title = title;
    this.author = author;
    this.description = description;
    this.owner = owner;
    this.createdAt = createdAt;
  }

  static copyToOtherOwner(otherItem: FeedItem, owner: User) {
    return new FeedItem(
      uid(),
      otherItem.hash,
      otherItem.url,
      otherItem.title,
      otherItem.author,
      otherItem.description,
      owner,
      new Date(),
    );
  }
}
