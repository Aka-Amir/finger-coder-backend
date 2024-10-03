import { Injectable } from '@nestjs/common';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { Repository } from 'typeorm';
import { Ticket } from './entities/ticket.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class TicketsService {
  constructor(
    @InjectRepository(Ticket)
    private readonly repo: Repository<Ticket>,
  ) {}

  create(createTicketDto: CreateTicketDto) {
    return this.repo.save({
      ...createTicketDto,
      disableAt: createTicketDto.disableAt as Date | null,
    });
  }

  findAll() {
    return this.repo.findAndCount();
  }

  findOne(id: number) {
    return this.repo.findOne({
      where: {
        id,
      },
    });
  }

  update(id: number, updateTicketDto: UpdateTicketDto) {
    return this.repo.update(id, updateTicketDto);
  }

  remove(id: number) {
    return this.repo.delete(id);
  }
}
