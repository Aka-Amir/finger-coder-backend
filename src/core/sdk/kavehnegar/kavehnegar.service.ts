import { Inject, Injectable } from '@nestjs/common';
import { kavenegar } from 'kavenegar';
import {
  KAVENEGAR_INSTANCE,
  KAVENEGAR_PHONE_SENDER,
} from './kavehnegar.constants';
import { Observable, Subscriber } from 'rxjs';
import { SendCodeType } from './types/send-code.type';
import { KavenegarResponseType } from './types/kavenegar-response.type';

@Injectable()
export class KavehnegarService {
  constructor(
    @Inject(KAVENEGAR_INSTANCE)
    private readonly api: kavenegar.KavenegarInstance,
    @Inject(KAVENEGAR_PHONE_SENDER)
    private readonly sender: string,
  ) {
    if (!sender) {
      throw new Error('No sender provided');
    }

    if (!api) {
      throw new Error('Api not initialized');
    }
  }

  private responseHandler =
    (sub: Subscriber<unknown>) =>
    (response: KavenegarResponseType[], status: number, message: string) => {
      sub.next({ response, status, message });
      sub.complete();
    };

  sendOtp(data: SendCodeType) {
    return new Observable((sub) => {
      this.api.VerifyLookup(
        {
          receptor: data.phoneNumber,
          template: data.templateId,
          token: data.code,
          token2: data.code2 || undefined,
          token3: data.code3 || undefined,
          type: data.type || undefined,
        },
        this.responseHandler(sub),
      );
    });
  }

  sendSms(message: string, phoneNumbers: string[]) {
    return new Observable((sub) => {
      this.api.Send(
        {
          sender: this.sender,
          message,
          receptor: phoneNumbers.toString(),
        },
        this.responseHandler(sub),
      );
    });
  }
}
