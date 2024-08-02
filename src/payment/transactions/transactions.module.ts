import { DynamicModule, Module } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { Transactions } from './entities/transactions.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionsController } from './transactions.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Transactions])],
  controllers: [TransactionsController],
  exports: [TransactionsService],
  providers: [TransactionsService],
})
export class TransactionsModule {
  static forFeature(): DynamicModule {
    return {
      module: TransactionsModule,
      imports: [TypeOrmModule.forFeature([Transactions])],
      providers: [TransactionsService],
      exports: [TransactionsService],
    };
  }
}
