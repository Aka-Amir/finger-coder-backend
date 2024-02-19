import { Inject, Injectable } from '@nestjs/common';
import * as constants from './zibal.consts';
import { IZibalConfig } from './types/zibal-config.type';

@Injectable()
export class ZibalSdkService {
  constructor(
    @Inject(constants.CONFIG) private readonly config: IZibalConfig,
    @Inject(constants.MODULE_SCOPE) public readonly moduleScope: string,
  ) {}

  createLink(amount: number) {
    console.log(this.config.merchantId, this.moduleScope);
    return this.moduleScope;
  }
}
