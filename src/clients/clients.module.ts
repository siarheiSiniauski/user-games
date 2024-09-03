// src/clients/clients.module.ts

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Client } from './clients.entity';
import { ClientService } from './clients.service';
import { ClientController } from './clients.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Client])],
  providers: [ClientService],
  controllers: [ClientController],
  exports: [ClientService, TypeOrmModule.forFeature([Client])], // Экспортируем сервис и репозиторий
})
export class ClientsModule {}
