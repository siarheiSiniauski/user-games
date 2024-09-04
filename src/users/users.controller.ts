import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/guards/auth.guard';
import { User } from './users.entity';
import { UserService } from './users.service';

@UseGuards(AuthGuard)
@Controller('v1/users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // Обработчик для получения всех пользователей
  @Get()
  async findAll(): Promise<User[]> {
    return this.userService.findAll();
  }

  // Обработчик для поиска или создания пользователя по telegramId
  @Get(':telegramId')
  async findOrCreateUser(
    @Param('telegramId') telegramId: number,
  ): Promise<User> {
    return this.userService.findOrCreateUser(telegramId);
  }
}
