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
import { ZibalSdkModule } from './core/sdk/zibal';
import { TransactionsModule } from './transactions/transactions.module';
import { ConfigModule } from '@nestjs/config';
import { OfferCodesModule } from './offer-codes/offer-codes.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [
        join(__dirname, '.env.dev'),
        join(__dirname, '.env.prod'),
        join(__dirname, '.env'),
      ],
      isGlobal: true,
    }),
    CoreModule,
    AdminsModule,
    UsersModule,
    EventsModule,
    TeamModule,
    MediaModule,
    OfferCodesModule,
    TransactionsModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, 'public'),
    }),
    SponsersModule,
    PlansModule,
    ZibalSdkModule.forRoot({
      merchant: process.env.MERCHANT_ID,
      callbackUrl: `${process.env.PROTOCOL}://${process.env.HOST}/transactions/verify`,
      lazy: false,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
