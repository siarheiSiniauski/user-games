// src/guards/auth.guard.ts

import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Client } from '../clients/clients.entity';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    @InjectRepository(Client)
    private readonly clientRepository: Repository<Client>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.headers['x-battle-room'] as string; // Замените на ваш заголовок

    // Найти клиента с таким токеном
    const client = await this.clientRepository.findOne({ where: { token } });

    if (client) {
      if (!client.blocked) {
        return true; // Клиент не заблокирован и токен валиден
      } else {
        throw new ForbiddenException('Access denied: Client is blocked');
      }
    } else {
      throw new ForbiddenException(
        'Access denied: Invalid x-battle-room token',
      );
    }
  }
}
