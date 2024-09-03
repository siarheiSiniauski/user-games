import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { AdminAuthGuard } from 'src/guards/admin-auth.guard';
import { ClientService } from './clients.service';
import { Client } from './clients.entity';

@UseGuards(AdminAuthGuard)
@Controller('clients')
export class ClientController {
  constructor(private readonly clientService: ClientService) {}

  // Создание нового клиента
  @Post()
  async create(
    @Body() createClientDto: { email: string; token: string },
  ): Promise<Client> {
    return this.clientService.create(createClientDto);
  }

  // Получение всех клиентов
  @Get()
  async findAll(): Promise<Client[]> {
    return this.clientService.findAll();
  }

  // Получение клиента по ID
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Client> {
    return this.clientService.findOne(id);
  }

  // Обновление клиента
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateClientDto: Partial<Client>,
  ): Promise<Client> {
    return this.clientService.update(id, updateClientDto);
  }

  // Блокировка клиента
  @Patch(':id/block')
  async blockClient(@Param('id') id: string): Promise<Client> {
    return this.clientService.blockClient(id);
  }
}
