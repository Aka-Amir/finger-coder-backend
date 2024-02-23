import { Injectable } from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Event } from './entities/event.entity';
import { Repository } from 'typeorm';
import { ZibalSdkService } from 'src/core/sdk/zibal';
import { lastValueFrom } from 'rxjs';
import { TransactionsService } from 'src/transactions/transactions.service';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event) private readonly repo: Repository<Event>,
    private readonly zibalSdk: ZibalSdkService,
    private readonly transactionsService: TransactionsService,
  ) {}
  create(createEventDto: CreateEventDto) {
    return this.repo.save({
      ...createEventDto,
      startDate: new Date(createEventDto.startDate),
    });
  }

  async pay(id: number) {
    const event = await this.findOne(id);
    const priceIRR = event.price * 10;
    const payment = await lastValueFrom(
      this.zibalSdk.createLink({
        amount: priceIRR,
        orderId: id.toString(),
      }),
    );

    return {
      url: payment.gatewayUrl,
      trackId: payment.trackId,
    };
  }

  count() {
    return this.repo.count();
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
