import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { lastValueFrom } from 'rxjs';
import { Auth } from 'src/auth/@shared/entities/auth.entity';
import { CallBackResponseDTO, ZibalSdkService } from 'src/core/sdk/zibal';
import { OfferCodesService } from 'src/offer-codes/offer-codes.service';
import { TransactionsService } from 'src/transactions/transactions.service';
import ValidationStage from 'src/transactions/types/validation-stage.enum';
import { LessThan, Not, Repository } from 'typeorm';
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
    private readonly offersService: OfferCodesService,
  ) {}

  create(createEventDto: CreateEventDto) {
    return this.repo.save({
      ...createEventDto,
      startDate: new Date(createEventDto.startDate),
    });
  }
  private calculateDiscount(price: number, discount: number): number {
    const amount = price * (discount / 100);
    return price - amount;
  }

  async pay(
    id: number,
    user: string,
    offerCode?: string,
    callBaclUrl = 'events/confirm',
  ) {
    const event = await this.findOne(id);

    let priceIRR = event.price * 10;

    if (Date.now() >= event.startDate.getTime()) {
      throw new ForbiddenException('Time_exceeded'.toUpperCase());
    }

    if (event.limit === 0) {
      throw new ForbiddenException('Reached_limit'.toUpperCase());
    }

    const registeration = await this.registeration(user, id);

    if (Boolean(registeration)) {
      throw new ForbiddenException('USER_REGISTERED');
    }

    if (event.discount) {
      priceIRR = this.calculateDiscount(priceIRR, event.discount);
    }

    if (offerCode) {
      const offer = await this.offersService.findOne(offerCode);
      if (
        (offer.user && (offer.user as Auth).id === user) ||
        (offer.event && (offer.event as Event).id === id)
      ) {
        priceIRR = this.calculateDiscount(priceIRR, offer.amount);
      }
      // else {
      //   throw new ForbiddenException('INVALID_OFFER_CODE');
      // }
    }

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
      offerCode,
    });

    return {
      url: payment.gatewayUrl,
      trackId: payment.trackId,
    };
  }

  async registeration(userId: string, eventId: number): Promise<EventsPayment> {
    return this.paymentRepo.findOne({
      where: {
        user: userId,
        event: eventId,
      },
      select: {
        transaction: true,
      },
    });
  }

  async getActiveEvents() {
    let events = await this.repo.find({
      where: {
        startDate: Not(LessThan(new Date())),
      },
    });

    if (!events.length) {
      events = await this.repo.find({
        take: 1,
        order: {
          startDate: {
            direction: 'DESC',
          },
        },
      });
    }

    return events;
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

    const { limit } = await this.repo.findOne({
      where: {
        id: eventId,
      },
      select: ['limit'],
    });

    if (limit !== undefined && limit !== null) {
      await this.repo.update(eventId, {
        limit: limit - 1,
      });
    }

    if (!response.transaction.user) {
      throw new InternalServerErrorException('U_UND');
    }

    await this.paymentRepo.insert({
      transaction: response.transaction.id.toString(),
      user: (response.transaction.user as Auth).id,
      event: eventId,
    });

    const verificationResponse = await lastValueFrom(
      this.zibalSdk.verifyPayment(+response.transaction.id),
    );

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
    return this.repo.findAndCount({
      skip: from,
      take: to - from,
      order: {
        startDate: {
          direction: 'DESC',
        },
      },
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
