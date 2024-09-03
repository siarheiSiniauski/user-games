import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Client } from '../clients/clients.entity';

@Injectable()
export class ClientService {
  constructor(
    @InjectRepository(Client)
    private readonly clientRepository: Repository<Client>,
  ) {}

  // Создание нового клиента
  async create(createClientDto: {
    email: string;
    token: string;
  }): Promise<Client> {
    const client = this.clientRepository.create(createClientDto);
    return this.clientRepository.save(client);
  }

  // Получение всех клиентов
  async findAll(): Promise<Client[]> {
    return this.clientRepository.find();
  }

  // Получение клиента по ID
  async findOne(id: string): Promise<Client> {
    const client = await this.clientRepository.findOne({
      where: { id },
    });
    if (!client) {
      throw new NotFoundException(`Client with ID ${id} not found`);
    }
    return client;
  }

  // Обновление данных клиента
  async update(id: string, updateClientDto: Partial<Client>): Promise<Client> {
    const client = await this.clientRepository.preload({
      id,
      ...updateClientDto,
    });

    if (!client) {
      throw new NotFoundException(`Client with ID ${id} not found`);
    }

    return this.clientRepository.save(client);
  }

  // Блокировка клиента
  async blockClient(id: string): Promise<Client> {
    const client = await this.findOne(id); // Проверяем, существует ли клиент
    client.blocked = true;
    return this.clientRepository.save(client);
  }
}
