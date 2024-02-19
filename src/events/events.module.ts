import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/core/auth';
import { Event } from './entities/event.entity';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';
import { ZibalSdkModule } from 'src/core/sdk/zibal/zibal.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Event]),
    AuthModule,
    ZibalSdkModule.forFeature('events'),
  ],
  controllers: [EventsController],
  providers: [EventsService],
})
export class EventsModule {}
