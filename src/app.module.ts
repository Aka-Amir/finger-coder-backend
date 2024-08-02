import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { CoreModule } from './core/core.module';
import { KavehnegarModule } from './core/sdk/kavehnegar/kavehnegar.module';
import { ZibalSdkModule } from './core/sdk/zibal';

// Domains
import { UsersModule } from './users/users.module';
import { ProductModule } from './product/product.module';
import { SupportModule } from './support/support.module';
import { PaymentModule } from './payment/payment.module';
import { InfoModule } from './info/info.module';

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

    UsersModule,
    CoreModule,
    ProductModule,
    SupportModule,
    PaymentModule,
    InfoModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
