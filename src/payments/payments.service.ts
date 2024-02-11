import { Inject, Injectable } from '@nestjs/common';
import { MERCHANT_ID_TOKEN_KEY } from './payment.consts';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class PaymentsService {
  constructor(
    private readonly httpService: HttpService,
    @Inject(MERCHANT_ID_TOKEN_KEY) private readonly merchantID: string,
  ) {}

  // creatNewPayment() {}
}
