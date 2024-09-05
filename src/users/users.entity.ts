import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  telegramId: number;

  @Column({ default: null })
  avatar: string;

  @Column({ default: null })
  token: string;
}
