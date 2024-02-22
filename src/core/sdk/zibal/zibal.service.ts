import { Inject, Injectable } from '@nestjs/common';
import * as constants from './zibal.consts';
import { IZibalConfig, IZibalFeatureConfig } from './types/zibal-config.type';
import { HttpService } from '@nestjs/axios';
import { IRequestForGateway } from './types/requests.types';
import { IGatewayResponse, IVerifyResponse } from './types/response.types';
import { map } from 'rxjs';

@Injectable()
export class ZibalSdkService {
  constructor(
    @Inject(constants.CONFIG) private readonly config: IZibalConfig,
    @Inject(constants.FEATURE_CONFIG)
    public readonly featureConf: IZibalFeatureConfig,
    private readonly http: HttpService,
  ) {}

  private getRoute(route: string) {
    if (this.featureConf.lazy) return `${route}/lazy`;
    return route;
  }

  createLink(data: IRequestForGateway) {
    return this.http
      .post<IGatewayResponse>(this.getRoute('request'), {
        callbackUrl: this.config.credentials.callbackUrl,
        merchant: this.config.credentials.merchant,
        ...data,
      })
      .pipe(map((data) => data.data))
      .pipe(
        map((response) => ({
          ...response,
          gatewayUrl: this.config.getGatewayURL(response.trackId),
        })),
      );
  }

  verifyPayment(trackId: number) {
    return this.http.post<IVerifyResponse>(this.getRoute('verify'), {
      merchant: this.config.credentials.merchant,
      trackId,
    });
  }
}
