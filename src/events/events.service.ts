import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { lastValueFrom } from 'rxjs';
import { CallBackResponseDTO, ZibalSdkService } from 'src/core/sdk/zibal';
import { TransactionsService } from 'src/transactions/transactions.service';
import ValidationStage from 'src/transactions/types/validation-stage.enum';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { Event } from './entities/event.entity';
import { EventsPayment } from './entities/events-payment.entity';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event) private readonly repo: Repository<Event>,
    @InjectRepository(EventsPayment)
    private readonly paymentRepo: Repository<EventsPayment>,
    private readonly zibalSdk: ZibalSdkService,
    private readonly transactionsService: TransactionsService,
  ) {}

  create(createEventDto: CreateEventDto) {
    return this.repo.save({
      ...createEventDto,
      startDate: new Date(createEventDto.startDate),
    });
  }

  async pay(id: number, user: number, callBaclUrl = 'events/confirm') {
    const event = await this.findOne(id);
    const priceIRR = event.price * 10;
    const payment = await lastValueFrom(
      this.zibalSdk.createLink({
        amount: priceIRR,
        orderId: event.id.toString(),
        callBackUrl: this.zibalSdk.getCallbackUrl(callBaclUrl),
      }),
    );

    await this.transactionsService.createTransaction({
      id: payment.trackId.toString(),
      user: user,
    });

    return {
      url: payment.gatewayUrl,
      trackId: payment.trackId,
    };
  }

  async getAllPayments(eventId: number) {
    return this.paymentRepo.find({
      where: {
        event: eventId,
      },
      select: ['id', 'transaction', 'event', 'user'],
      relations: {
        event: true,
        transaction: true,
        user: true,
      },
    });
  }

  async confirmPayment(verifyResponse: CallBackResponseDTO) {
    const response =
      await this.transactionsService.changeTransactionValidationState(
        verifyResponse.trackId.toString(),
        verifyResponse.success === '1'
          ? ValidationStage.SUCCESS
          : ValidationStage.FAILED,
      );

    const eventId = +this.zibalSdk.getRawOrderId(verifyResponse.orderId);

    if (Number.isNaN(eventId)) {
      throw new BadRequestException('Invalid orderID');
    }

    console.log({
      transaction: response.transaction.id,
      user: response.transaction.user,
      event: eventId,
    });

    if (!response.transaction.user) {
      throw new InternalServerErrorException('U_UND');
    }

    const { raw } = await this.paymentRepo.insert({
      transaction: response.transaction.id.toString(),
      user: (response.transaction.user as User).id,
      event: eventId,
    });

    console.log(raw);

    const verificationResponse = await lastValueFrom(
      this.zibalSdk.verifyPayment(+response.transaction.id),
    );

    console.log(verificationResponse);

    await this.transactionsService.setMetaData(
      response.transaction.id,
      verificationResponse,
    );

    return {
      message: 'success',
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
