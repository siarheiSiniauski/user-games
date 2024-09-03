import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { parse } from 'pg-connection-string';
import * as dotenv from 'dotenv';

import { Client } from '../clients/clients.entity';
import { User } from '../users/users.entity';

dotenv.config();

// Получите строку подключения из переменной окружения
const connectionString = process.env.DATABASE_URL || '';

// Парсите строку подключения
const config = parse(connectionString);

console.log('config', config);

export const getConfigPostgres = async (
  configService: ConfigService,
): Promise<TypeOrmModuleOptions> => {
  return {
    type: 'postgres',
    host: config.host,
    port: parseInt(config.port, 10),
    username: config.user,
    password: config.password,
    database: config.database,
    entities: [User, Client], // Укажите сущности
    synchronize: configService.get<boolean>('DATABASE_SYNC'), // Включить синхронизацию схемы
  };
};
