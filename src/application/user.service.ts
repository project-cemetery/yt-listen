import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { uid } from 'uid';

import { User } from 'src/entity/user.entity';

@Injectable()
export class UserManager {
  constructor(
    @InjectEntityManager()
    private readonly em: EntityManager,
    @InjectRepository(User)
    private readonly repo: Repository<User>,
  ) {}

  async resolveTelegramUser(telegramId?: number): Promise<User> {
    if (!telegramId) {
      throw new NotFoundException();
    }

    const existUser = await this.repo.findOne({ telegramId });

    if (existUser) {
      return existUser;
    }

    const newUser = new User(uid(), telegramId);

    await this.em.save(newUser);

    return newUser;
  }

  async getUser(id: string): Promise<User> {
    return this.repo.findOneOrFail(id);
  }
}
