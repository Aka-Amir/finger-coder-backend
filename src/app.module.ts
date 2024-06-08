import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AdminsModule } from './admins/admins.module';
import { CoreModule } from './core/core.module';
import { KavehnegarModule } from './core/sdk/kavehnegar/kavehnegar.module';
import { ZibalSdkModule } from './core/sdk/zibal';
import { EventsModule } from './events/events.module';
import { MediaModule } from './media/media.module';
import { OfferCodesModule } from './offer-codes/offer-codes.module';
import { PlansModule } from './plans/plans.module';
import { SponsersModule } from './sponsers/sponsers.module';
import { TeamModule } from './team/team.module';
import { TransactionsModule } from './transactions/transactions.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';

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
    SponsersModule,
    PlansModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, 'public'),
    }),
    ZibalSdkModule.forRoot({
      merchant: process.env.MERCHANT_ID,
      callbackUrl: `${process.env.PROTOCOL}://${process.env.HOST}/transactions/verify`,
      lazy: false,
    }),
    KavehnegarModule.forRoot({
      apikey:
        '2B2B6F6A313438626E556F4D705465644F5A2B6278513252734C6E394969684A41353673756430497972343D',
      sender: '2000500666',
    }),
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
