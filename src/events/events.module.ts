import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/core/auth';
import { Event } from './entities/event.entity';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';
import { ZibalSdkModule } from 'src/core/sdk/zibal/zibal.module';
import { TransactionsModule } from 'src/transactions/transactions.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Event]),
    AuthModule,
    TransactionsModule.forFeature(),
    ZibalSdkModule.forFeature({
      moduleScope: 'events',
      lazy: true,
    }),
  ],
  controllers: [EventsController],
  providers: [EventsService],
})
export class EventsModule {}
