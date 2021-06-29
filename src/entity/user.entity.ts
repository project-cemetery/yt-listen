import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('user')
export class User {
  @PrimaryColumn()
  readonly id: string;

  @Column()
  readonly telegramId: number;

  constructor(id: string, telegramId: number) {
    this.id = id;
    this.telegramId = telegramId;
  }
}
