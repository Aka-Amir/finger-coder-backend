import { DynamicModule, Module, Provider } from '@nestjs/common';
import { KavenegarApi } from 'kavenegar';
import {
  IKavenegarRootConfig,
  IKavenegarFeatureConfig,
} from './types/kavenegar-config.type';
import * as constants from './kavehnegar.constants';
import { KavehnegarService } from './kavehnegar.service';

@Module({})
export class KavehnegarModule {
  static forRoot(config: IKavenegarRootConfig): DynamicModule {
    const api = KavenegarApi({
      apikey: config.apikey,
      host: config.host,
      version: config.version,
    });

    const providers: Provider[] = [
      {
        provide: constants.KAVENEGAR_INSTANCE,
        useValue: api,
      },
      {
        provide: constants.KAVENEGAR_PHONE_SENDER_ROOT,
        useValue: config.sender || '',
      },
    ];

    return {
      module: KavehnegarModule,
      global: true,
      providers: providers,
      exports: [
        constants.KAVENEGAR_INSTANCE,
        constants.KAVENEGAR_PHONE_SENDER_ROOT,
      ],
    };
  }

  static forFeature(config?: IKavenegarFeatureConfig): DynamicModule {
    return {
      module: KavehnegarModule,
      providers: [
        {
          inject: [constants.KAVENEGAR_PHONE_SENDER_ROOT],
          provide: constants.KAVENEGAR_PHONE_SENDER,
          useFactory: (phoneNumber?: string) =>
            config?.sender || phoneNumber || '',
        },
        KavehnegarService,
      ],
      exports: [KavehnegarService],
    };
  }
}
