import { HttpService } from '@nestjs/axios';
import { Inject, Injectable } from '@nestjs/common';
import { map, tap } from 'rxjs';
import { IRequestForGateway } from './types/requests.types';
import { IGatewayResponse, IVerifyResponse } from './types/response.types';
import { IZibalConfig, IZibalFeatureConfig } from './types/zibal-config.type';
import * as constants from './zibal.consts';

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
    return `v1/${route}`;
  }

  public getCallbackUrl(url: string) {
    return `${process.env.PROTOCOL}://${process.env.HOST}/${url}`;
  }

  public getRawOrderId(orderId: string): string {
    return orderId.replace(`${this.featureConf.moduleScope}#`, '');
  }

  createLink(data: IRequestForGateway) {
    data.orderId = `${this.featureConf.moduleScope}#${data.orderId}`;
    return this.http
      .post<IGatewayResponse>(this.getRoute('request'), {
        callbackUrl: data.callBackUrl || this.config.credentials.callbackUrl,
        merchant: this.config.credentials.merchant,
        ...data,
      })
      .pipe(
        map(({ data: httpResponse, config }) => {
          console.log(config.baseURL + config.url);
          // console.log(httpResponse);
          return httpResponse;
        }),
      )
      .pipe(
        map((response) => ({
          ...response,
          gatewayUrl: this.config.getGatewayURL(response.trackId),
        })),
      );
  }

  verifyPayment(trackId: number) {
    return this.http
      .post<IVerifyResponse>(this.getRoute('verify'), {
        merchant: this.config.credentials.merchant,
        trackId,
      })
      .pipe(tap((item) => console.log(item.config.baseURL + item.config.url)))
      .pipe(map(({ data }) => data));
  }
}
