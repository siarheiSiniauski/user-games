import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
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

  // Метод для обновления пользователя
  @Put(':telegramId')
  async updateUser(
    @Param('telegramId') telegramId: number,
    @Body() updateData: Partial<User>,
  ): Promise<User> {
    try {
      // Обновляем пользователя
      const updatedUser = await this.userService.updateUser(
        telegramId,
        updateData,
      );

      if (!updatedUser) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }

      return updatedUser;
    } catch {
      throw new HttpException(
        'Failed to update user',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('update-avatar')
  @UseInterceptors(FileInterceptor('file'))
  async updateAvatar(
    @Body('telegramId') telegramId: number,
    @UploadedFile() file: Express.Multer.File,
  ) {
    try {
      if (!file) {
        throw new Error('No file uploaded');
      }

      const result = await this.userService.updateAvatar(telegramId, file);

      return result;
    } catch (error) {
      console.error('Error updating avatar:', error);
      throw new Error('Failed to update avatar');
    }
  }
}
