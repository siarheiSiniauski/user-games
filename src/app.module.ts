import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { getConfigPostgres } from './configs/database.config';

import { UserModule } from './users/users.module';
import { UserController } from './users/users.controller';
import { UserService } from './users/users.service';

import { ClientModule } from './clients/clients.module';
import { ClientController } from './clients/clients.controller';
import { ClientService } from './clients/clients.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Делает ConfigModule глобальным, чтобы его не нужно было импортировать в каждый модуль
      envFilePath: '.env', // Путь к файлу .env
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: getConfigPostgres,
    }),
    UserModule,
    ClientModule,
  ],
  controllers: [ClientController, UserController],
  providers: [ClientService, UserService],
})
export class AppModule {}
