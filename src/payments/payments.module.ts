import { DynamicModule, Module } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { TransactionsModule } from './transactions/transactions.module';
import { MERCHANT_ID_TOKEN_KEY, PAYMENT_GATEWAY } from './payment.consts';
import { HttpModule } from '@nestjs/axios';

@Module({})
export class PaymentsModule {
  static forRoot(merchantID = 'zibal'): DynamicModule {
    return {
      module: PaymentsModule,
      controllers: [PaymentsController],
      imports: [
        TransactionsModule,
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
