import { Module } from '@nestjs/common';
import { EventsModule } from './events/events.module';
import { OfferCodesModule } from './offer-codes/offer-codes.module';

@Module({
  imports: [EventsModule, OfferCodesModule],
})
export class ProductModule {}
