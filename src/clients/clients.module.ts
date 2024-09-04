// src/clients/clients.module.ts

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Client } from './clients.entity';
import { ClientService } from './clients.service';
import { ClientController } from './clients.controller';
import { AdminAuthGuard } from 'src/guards/admin-auth.guard';
import { AuthGuard } from 'src/guards/auth.guard';

@Module({
  imports: [TypeOrmModule.forFeature([Client])],
  providers: [ClientService, AdminAuthGuard, AuthGuard],
  controllers: [ClientController],
  exports: [ClientService, TypeOrmModule], // Экспортируем сервис и репозиторий
})
export class ClientModule {}
