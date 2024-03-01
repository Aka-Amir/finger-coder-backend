import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/core/auth';
import { ZibalSdkModule } from 'src/core/sdk/zibal/zibal.module';
import { TransactionsModule } from 'src/transactions/transactions.module';
import { Event } from './entities/event.entity';
import { EventsPayment } from './entities/events-payment.entity';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';
import { OfferCodesModule } from 'src/offer-codes/offer-codes.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Event, EventsPayment]),
    TransactionsModule.forFeature(),
    AuthModule,
    OfferCodesModule.forFeature(),
    ZibalSdkModule.forFeature({
      moduleScope: 'events',
      lazy: false,
    }),
  ],
  controllers: [EventsController],
  providers: [EventsService],
})
export class EventsModule {}
