import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transactions } from './entities/transactions.entity';
import { TransactionConstruction } from './types/create-transaction.type';
import ValidationStage from './types/validation-stage.enum';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transactions)
    private readonly transactionsDb: Repository<Transactions>,
  ) {}

  async createTransaction(data: TransactionConstruction) {
    Logger.debug(`User : ${data.user}`, TransactionsService.name);
    await this.transactionsDb.insert({
      user: data.user,
      id: data.id,
      metaData: data.metaData,
    });
    return {
      id: data.id,
    };
  }

  findById(id: string) {
    return this.transactionsDb.findOne({
      where: {
        id,
      },
    });
  }

  async setMetaData(trackId: string, metaData: Record<string | number, any>) {
    return await this.transactionsDb.update(trackId, {
      metaData,
    });
  }

  async changeTransactionValidationState(
    transactionId: string,
    state: ValidationStage,
  ) {
    const transaction = await this.transactionsDb.findOne({
      where: {
        id: transactionId,
      },
      select: ['id', 'metaData', 'user', 'validationStage'],
      relations: {
        user: true,
      },
    });

    if (!transaction) {
      throw new NotFoundException();
    }

    if (transaction.validationStage !== ValidationStage.IN_PROGRESS) {
      throw new BadRequestException('T_SEALED');
    }

    const updateResponse = await this.transactionsDb.update(transactionId, {
      validationStage: state,
    });

    return {
      transaction,
      updateResponse,
    };
  }
}
