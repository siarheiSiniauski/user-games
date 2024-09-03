import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_GUARD } from '@nestjs/core';

import { AdminAuthGuard } from './guards/admin-auth.guard';
import { AuthGuard } from './guards/auth.guard';
import { getConfigPostgres } from './configs/database.config';

import { UsersModule } from './users/users.module';
import { UsersController } from './users/users.controller';
import { UsersService } from './users/users.service';

import { ClientsModule } from './clients/clients.module';
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
    UsersModule,
    ClientsModule,
  ],
  controllers: [ClientController, UsersController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: AdminAuthGuard,
    },
    ClientService,
    UsersService,
  ],
})
export class AppModule {}
