import { JwtModuleOptions } from '@nestjs/jwt';
import * as dotenv from 'dotenv';

dotenv.config();

const key = process.env.JWT_SECRET;

export const getJwtConfig = (): JwtModuleOptions => {
  return {
    secret: key, // Замените на ваш секретный ключ
    signOptions: { expiresIn: '3h' }, // Настройте время жизни токена по вашему усмотрению
  };
};
