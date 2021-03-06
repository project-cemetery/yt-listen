import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { uid } from 'uid';

import { User } from 'src/entity/user.entity';
import { Analyst } from './analyst.service';
import { UrlType } from './url_classifier.service';

@Injectable()
export class UserManager {
  constructor(
    @InjectEntityManager()
    private readonly em: EntityManager,
    @InjectRepository(User)
    private readonly repo: Repository<User>,
    private readonly analyst: Analyst,
  ) {}

  async canUse(user: User, url: UrlType): Promise<boolean> {
    // TODO: Change it after payment feature
    return url === UrlType.Video;
  }

  async resolveTelegramUser(telegramId?: number): Promise<User> {
    if (!telegramId) {
      throw new NotFoundException('User not found');
    }

    const existUser = await this.repo.findOne({ telegramId });

    if (existUser) {
      return existUser;
    }

    const newUser = new User(uid(), telegramId);

    await this.em.save(newUser);
    await this.analyst.logEvent(newUser, 'user_created');

    return newUser;
  }

  async getUser(id: string): Promise<User> {
    const user = await this.repo.findOne(id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }
}
