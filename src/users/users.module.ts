import { Module } from '@nestjs/common';
import { UserController } from './users.controller';
import { UserService } from './users.service';
import { AuthGuard } from 'src/guards/auth.guard';
import { User } from './users.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientModule } from 'src/clients/clients.module';
import { JwtService } from '@nestjs/jwt';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), ClientModule, CloudinaryModule],
  providers: [UserService, AuthGuard, JwtService],
  controllers: [UserController],
  exports: [UserService, TypeOrmModule],
})
export class UserModule {}
