import { Injectable } from '@nestjs/common';
import { v2 as cloudinary, UploadApiOptions, UploadApiResponse } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import * as multer from 'multer';
import { parse } from 'parse-cloudinary-url';
import jwt from 'jsonwebtoken';

@Injectable()
export class CloudinaryService {
  private readonly JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

  constructor() {
    // Разбор URL и настройка Cloudinary
    const cloudinaryUrl = process.env.CLOUDINARY_URL;
    if (cloudinaryUrl) {
      const { cloudName, apiKey, apiSecret } =
        this.getCloudinaryCredentials(cloudinaryUrl);
      cloudinary.config({
        cloud_name: cloudName,
        api_key: apiKey,
        api_secret: apiSecret,
      });
    } else {
      throw new Error('CLOUDINARY_URL environment variable is not set');
    }
  }

  // Метод для получения Cloudinary учетных данных из URL
  private getCloudinaryCredentials(url: string) {
    const { cloudName, apiKey, apiSecret } = parse(url);
    if (cloudName && apiKey && apiSecret) {
      return { cloudName, apiKey, apiSecret };
    } else {
      throw new Error('Invalid Cloudinary URL');
    }
  }

  // Метод для создания Multer с Cloudinary Storage с динамической папкой
  createMulterOptions(folder: string) {
    const storage = new CloudinaryStorage({
      cloudinary: cloudinary,
      params: (req, file) => ({
        public_id: `${folder}/${file.originalname.split('.')[0]}`, // Динамическая папка
        transformation: [
          { quality: 'auto', fetch_format: 'auto' }, // Автоматический выбор формата
        ],
      }),
    });

    return multer({ storage });
  }

  // Метод для загрузки изображения напрямую через Cloudinary API
  async uploadImage(
    file: Express.Multer.File,
    options?: UploadApiOptions,
  ): Promise<UploadApiResponse> {
    return new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(options, (error, result) => {
          if (error) return reject(error);
          resolve(result as UploadApiResponse); // Явное приведение типа
        })
        .end(file.buffer);
    });
  }

  // Метод для получения и декодирования токена
  getTelegramIdFromToken(token: string): string | null {
    try {
      // Проверка валидности токена
      const decoded = jwt.verify(token, this.JWT_SECRET);
      return (decoded as any)?.telegramId || null; // Извлечение telegramId
    } catch (error) {
      console.error('Error verifying token:', error);
      return null;
    }
  }
}
