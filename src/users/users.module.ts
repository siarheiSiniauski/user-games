import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AuthGuard } from 'src/guards/auth.guard';
import { User } from './users.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientsModule } from 'src/clients/clients.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), ClientsModule],
  controllers: [UsersController],
  providers: [UsersService, AuthGuard],
})
export class UsersModule {}
