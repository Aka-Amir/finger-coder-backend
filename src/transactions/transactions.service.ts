import { Inject, Injectable } from '@nestjs/common';
import { Transactions } from './entities/transactions.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TransactionsService {
  constructor(
    @Inject(Transactions)
    private readonly transactionsDb: Repository<Transactions>,
  ) {}
}
