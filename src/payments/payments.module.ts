import { HttpModule } from '@nestjs/axios';
import { DynamicModule, Module } from '@nestjs/common';
import { MERCHANT_ID_TOKEN_KEY, PAYMENT_GATEWAY } from './payment.consts';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';

@Module({})
export class PaymentsModule {
  static forRoot(merchantID = 'zibal'): DynamicModule {
    return {
      module: PaymentsModule,
      controllers: [PaymentsController],
      imports: [
        HttpModule.register({
          baseURL: PAYMENT_GATEWAY,
        }),
      ],
      providers: [
        PaymentsService,
        {
          useValue: merchantID,
          provide: MERCHANT_ID_TOKEN_KEY,
        },
      ],
    };
  }
}
