import { DynamicModule, Module } from '@nestjs/common';
import { TransactionsService } from './transactions.service';

@Module({
  imports: [],
  exports: [TransactionsService],
  providers: [TransactionsService],
})
export class TransactionsModule {
  static forFeature(): DynamicModule {
    return {
      module: TransactionsModule,
      imports: [],
      exports: [TransactionsService],
      providers: [TransactionsService],
    };
  }
}
