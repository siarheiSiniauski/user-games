import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { parse } from 'pg-connection-string';

import { User } from './users/users.entity';
import { Client } from './clients/clients.entity';

dotenv.config();

// Получите строку подключения из переменной окружения
const connectionString = process.env.DATABASE_URL || '';

// Парсите строку подключения
const config = parse(connectionString);

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: config.host,
  port: parseInt(config.port, 10),
  username: config.user,
  password: config.password,
  database: config.database,
  ssl: {
    rejectUnauthorized: JSON.parse(process.env.SSL_REJECT_UNAUTHORIZED),
  },
  entities: [User, Client], // Укажите сущности
  migrations: ['src/migrations/*.ts'],
  synchronize: Boolean(process.env.DATABASE_SYNC), // Убедитесь, что synchronize выключен в продакшене
});
