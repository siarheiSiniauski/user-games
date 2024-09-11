import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  Param,
  UseGuards,
  Headers,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CloudinaryService } from './cloudinary.service';
import { AuthGuard } from 'src/guards/auth.guard';

@UseGuards(AuthGuard)
@Controller('upload')
export class UploadController {
  constructor(private readonly cloudinaryService: CloudinaryService) {}

  @Post(':folder')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Headers('Authorization') authHeader: string,
    @Param('folder') folder: string,
  ) {
    // Извлечение токена из заголовка
    const token = authHeader?.split(' ')[1]; // Предполагается, что токен находится после "Bearer"

    if (token) {
      const telegramId = this.cloudinaryService.getTelegramIdFromToken(token);
      console.log('Telegram ID:', telegramId);
    }

    // Загружаем файл в Cloudinary с указанием папки
    return this.cloudinaryService.uploadImage(file, { folder });
  }
}
