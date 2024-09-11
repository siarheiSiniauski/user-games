import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Client } from './clients.entity';
import { ClientService } from './clients.service';
import { ClientController } from './clients.controller';
import { AuthGuard } from 'src/guards/auth.guard';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';

@Module({
  imports: [TypeOrmModule.forFeature([Client]), CloudinaryModule],
  providers: [ClientService, AuthGuard],
  controllers: [ClientController],
  exports: [ClientService, TypeOrmModule], // Экспортируем сервис и репозиторий
})
export class ClientModule {}
