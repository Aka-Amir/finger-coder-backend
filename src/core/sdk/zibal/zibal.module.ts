import { DynamicModule } from '@nestjs/common';
import {
  IZibalConfig,
  IZibalFeatureConfig,
  ZibalCredentials,
} from './types/zibal-config.type';
import * as constants from './zibal.consts';
import { ZibalSdkService } from './zibal.service';
import { HttpModule } from '@nestjs/axios';

export class ZibalSdkModule {
  private static lazy: boolean;
  static forFeature(featureConfig: IZibalFeatureConfig): DynamicModule {
    featureConfig.lazy = ZibalSdkModule.lazy || featureConfig.lazy;
    return {
      module: ZibalSdkModule,
      imports: [
        HttpModule.register({
          baseURL: `${constants.BASE_URL}/`,
        }),
      ],
      providers: [
        {
          useValue: featureConfig,
          provide: constants.FEATURE_CONFIG,
        },
        ZibalSdkService,
      ],
      exports: [ZibalSdkService],
    };
  }

  static forRoot(credentials: ZibalCredentials): DynamicModule {
    const config: IZibalConfig = {
      credentials,
      getGatewayURL: (trackId: number) =>
        `${constants.BASE_URL}/start/${trackId}`,
    };

    return {
      module: ZibalSdkModule,
      global: true,
      providers: [
        {
          useValue: config,
          provide: constants.CONFIG,
        },
      ],
      exports: [
        {
          useValue: config,
          provide: constants.CONFIG,
        },
      ],
    };
  }
}
