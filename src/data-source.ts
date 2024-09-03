import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { parse } from 'pg-connection-string';

import { User } from './users/users.entity';

dotenv.config();

// Получите строку подключения из переменной окружения
const connectionString = process.env.DATABASE_URL;

// Парсите строку подключения
const config = parse(connectionString);

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: config.host,
  port: parseInt(config.port, 10),
  username: config.user,
  password: config.password,
  database: config.database,
  entities: [User],
  migrations: ['src/migrations/*.ts'],
  synchronize: Boolean(process.env.DATABASE_SYNC), // Убедитесь, что synchronize выключен в продакшене
});
