import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './users.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    private readonly jwtService: JwtService,

    private readonly cloudinaryService: CloudinaryService, // Внедрение CloudinaryService
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
        token: null,
      };
      user = this.userRepository.create(candidate);
      user = await this.userRepository.save(user);
    }

    // Генерация JWT токена
    const payload = { telegramId: user.telegramId };
    const token = this.jwtService.sign(payload);

    // Сохранение токена в базу данных
    user.token = token;
    user = await this.userRepository.save(user);

    return user;
  }

  // Метод для обновления пользователя по telegramId
  async updateUser(
    telegramId: number,
    updateData: Partial<User>,
  ): Promise<User | null> {
    // Попытка найти пользователя по telegramId
    const user = await this.userRepository.findOneBy({ telegramId });

    if (!user) {
      // Если пользователь не найден, возвращаем null
      return null;
    }

    // Обновляем поля пользователя
    this.userRepository.merge(user, updateData);

    // Сохраняем изменения в базе данных
    return this.userRepository.save(user);
  }

  // Метод для обновления аватара пользователя
  async updateAvatar(
    telegramId: number,
    file: Express.Multer.File,
  ): Promise<User | null> {
    try {
      const uploadResult = await this.cloudinaryService.uploadImage(file);

      const imageUrl = uploadResult.secure_url; // secure_url доступно после приведения типа

      return this.updateUser(telegramId, { avatar: imageUrl });
    } catch (error) {
      console.error('Error uploading image:', error);
      throw new Error('Failed to upload image');
    }
  }
}
