import {
  Controller,
  Get,
  Param,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from 'src/guards/auth.guard';
import { User } from './users.entity';
import { UserService } from './users.service';
import { FileInterceptor } from '@nestjs/platform-express';

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

  @Post(':telegramId/avatar')
  @UseInterceptors(FileInterceptor('file'))
  async updateAvatar(
    @Param('telegramId') telegramId: number,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.userService.updateAvatar(telegramId, file);
  }
}
