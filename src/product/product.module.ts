import { Module } from '@nestjs/common';
import { EventsModule } from './events/events.module';
import { OfferCodesModule } from './offer-codes/offer-codes.module';
import { TicketsModule } from './tickets/tickets.module';

@Module({
  imports: [EventsModule, OfferCodesModule, TicketsModule],
})
export class ProductModule {}
