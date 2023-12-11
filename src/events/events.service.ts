import { Injectable } from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Event } from './entities/event.entity';
import { Repository } from 'typeorm';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event) private readonly repo: Repository<Event>,
  ) {}
  create(createEventDto: CreateEventDto) {
    return this.repo.save({
      ...createEventDto,
      startDate: new Date(createEventDto.startDate),
    });
  }

  findAll(from: number, to: number) {
    return this.repo.find({
      skip: from,
      take: to - from,
    });
  }

  findOne(id: number) {
    return this.repo.findOne({
      where: { id },
    });
  }

  update(id: number, updateEventDto: UpdateEventDto) {
    return this.repo.update(id, updateEventDto);
  }

  remove(id: number) {
    return this.repo.delete(id);
  }
}
