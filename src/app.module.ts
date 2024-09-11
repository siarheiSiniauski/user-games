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
import { JwtModule } from '@nestjs/jwt';
import { getJwtConfig } from './configs/jwt.config';
import { CloudinaryModule } from './cloudinary/cloudinary.module';

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
    JwtModule.register(getJwtConfig()),
    UserModule,
    ClientModule,
    CloudinaryModule,
  ],
  controllers: [ClientController, UserController],
  providers: [ClientService, UserService],
})
export class AppModule {}
