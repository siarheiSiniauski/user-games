import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './users.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    private readonly jwtService: JwtService,
  ) {}

  // Метод для получения всех пользователей
  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  // Метод для получения пользователя по telegramId
  async findOrCreateUser(telegramId: number): Promise<User | null> {
    // Попытка найти пользователя по telegramId
    let user = await this.userRepository.findOneBy({ telegramId });

    // Генерация JWT токена
    const payload = { telegramId: user.telegramId, sub: user.id };
    const token = this.jwtService.sign(payload);

    // Если пользователь не найден, создаем нового
    if (!user) {
      const candidate = {
        name: `User-` + telegramId,
        telegramId: +telegramId,
        avatar: null,
        token,
      };
      user = this.userRepository.create(candidate);
      user = await this.userRepository.save(user);
    }

    // Сохранение токена в базу данных
    user.token = token;
    user = await this.userRepository.save(user);

    console.log('findOrCreateUser', user);

    return user;
  }
}
