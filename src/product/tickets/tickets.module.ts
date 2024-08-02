import { DynamicModule, Module } from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { TicketsController } from './tickets.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ticket } from './entities/ticket.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Ticket])],
  controllers: [TicketsController],
  providers: [TicketsService],
})
export class TicketsModule {
  static forFeature(): DynamicModule {
    return {
      module: TicketsModule,
      imports: [TypeOrmModule.forFeature([Ticket])],
      controllers: [TicketsController],
      providers: [TicketsService],
      exports: [TicketsService],
    };
  }
}
