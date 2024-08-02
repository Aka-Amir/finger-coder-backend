import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ZibalSdkModule } from 'src/core/sdk/zibal/zibal.module';
import { TransactionsModule } from 'src/payment/transactions/transactions.module';
import { Event } from './entities/event.entity';
import { EventsPayment } from './entities/events-payment.entity';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';
import { OfferCodesModule } from '../offer-codes/offer-codes.module';
import { TicketsModule } from '../tickets/tickets.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Event, EventsPayment]),
    TransactionsModule.forFeature(),
    OfferCodesModule.forFeature(),
    TicketsModule.forFeature(),
    ZibalSdkModule.forFeature({
      moduleScope: 'events',
      lazy: false,
    }),
  ],
  controllers: [EventsController],
  providers: [EventsService],
})
export class EventsModule {}
