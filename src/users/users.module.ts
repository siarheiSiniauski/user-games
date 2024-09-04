import { Module } from '@nestjs/common';
import { UserController } from './users.controller';
import { UserService } from './users.service';
import { AuthGuard } from 'src/guards/auth.guard';
import { User } from './users.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientModule } from 'src/clients/clients.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), ClientModule],
  providers: [UserService, AuthGuard],
  controllers: [UserController],
  exports: [UserService, TypeOrmModule],
})
export class UserModule {}
