import { Injectable } from '@nestjs/common';
import {
  v2 as cloudinary,
  UploadApiOptions,
  UploadApiResponse,
} from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import * as multer from 'multer';
import jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';
import { parseCloudinaryUrl } from 'src/utils/parseCloudinaryUrl';

dotenv.config();

@Injectable()
export class CloudinaryService {
  private readonly JWT_SECRET = process.env.JWT_SECRET;

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
    const { cloudName, apiKey, apiSecret } = parseCloudinaryUrl(url);
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
    folder?: string,
    width?: number,
    height?: number,
    crop: 'fill' | 'fit' | 'limit' | 'pad' | 'scale' | 'thumbnail' = 'fit',
    publicId?: string, // Имя файла
    options?: UploadApiOptions,
  ): Promise<UploadApiResponse> {
    if (!file || !file.buffer) {
      throw new Error('No file or file buffer provided');
    }

    // Опции загрузки изображения
    const uploadOptions: UploadApiOptions = {
      ...options,
      folder, // Указываем папку
      public_id: publicId, // Указываем имя файла
      transformation: {
        width,
        height,
        crop,
      },
    };

    return new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(uploadOptions, (error, result) => {
          if (error) return reject(error);
          resolve(result as UploadApiResponse);
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
