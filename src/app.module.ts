import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { AdminsModule } from './admins/admins.module';
import { CoreModule } from './core/core.module';
import { EventsModule } from './events/events.module';
import { MediaModule } from './media/media.module';
import { TeamModule } from './team/team.module';
import { UsersModule } from './users/users.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { SponsersModule } from './sponsers/sponsers.module';
import { PlansModule } from './plans/plans.module';
import { PaymentsModule } from './payments/payments.module';

@Module({
  imports: [
    CoreModule,
    AdminsModule,
    UsersModule,
    EventsModule,
    TeamModule,
    MediaModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, 'public'),
    }),
    SponsersModule,
    PlansModule,
    PaymentsModule.forRoot(),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
