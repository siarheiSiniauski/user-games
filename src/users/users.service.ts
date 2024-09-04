import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './users.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  // Метод для получения всех пользователей
  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  // Метод для получения пользователя по telegramId
  async findOrCreateUser(telegramId: number): Promise<User | null> {
    // Попытка найти пользователя по telegramId
    let user = await this.userRepository.findOneBy({ telegramId });

    // Если пользователь не найден, создаем нового
    if (!user) {
      const candidate = {
        name: `User-` + telegramId,
        telegramId: +telegramId,
        avatar: null,
      };
      user = this.userRepository.create(candidate);
      user = await this.userRepository.save(user);
    }

    return user;
  }
}
