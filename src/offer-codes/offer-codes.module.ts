import { DynamicModule, Module } from '@nestjs/common';
import { OfferCodesService } from './offer-codes.service';
import { OfferCodesController } from './offer-codes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OfferCode } from './entities/offer-code.entity';
import { AuthModule } from 'src/core/auth';

@Module({
  imports: [TypeOrmModule.forFeature([OfferCode]), AuthModule],
  controllers: [OfferCodesController],
  providers: [OfferCodesService],
})
export class OfferCodesModule {
  static forFeature(): DynamicModule {
    return {
      module: OfferCodesModule,
      imports: [TypeOrmModule.forFeature([OfferCode])],
      providers: [OfferCodesService],
      exports: [OfferCodesService],
    };
  }
}
