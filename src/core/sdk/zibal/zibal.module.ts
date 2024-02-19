import { DynamicModule } from '@nestjs/common';
import { IZibalConfig } from './types/zibal-config.type';
import * as constants from './zibal.consts';
import { ZibalSdkService } from './zibal.service';

export class ZibalSdkModule {
  static forFeature(moduleScope: string): DynamicModule {
    return {
      module: ZibalSdkModule,
      providers: [
        {
          useValue: moduleScope,
          provide: constants.MODULE_SCOPE,
        },
        ZibalSdkService,
      ],
      exports: [ZibalSdkService],
    };
  }

  static forRoot(config: IZibalConfig): DynamicModule {
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
