import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';

import { User } from './user.entity';

@Entity('feed_item')
export class FeedItem {
  @PrimaryColumn()
  readonly id: string;

  @Column()
  readonly hash: string;

  @Column()
  readonly url: string;

  @ManyToOne((type) => User)
  readonly owner?: User;

  @Column()
  readonly createdAt: Date;

  constructor(
    id: string,
    hash: string,
    url: string,
    owner: User,
    createdAt: Date,
  ) {
    this.id = id;
    this.hash = hash;
    this.url = url;
    this.owner = owner;
    this.createdAt = createdAt;
  }
}
