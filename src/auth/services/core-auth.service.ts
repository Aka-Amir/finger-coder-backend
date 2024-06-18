import { Injectable, Logger } from '@nestjs/common';
import { BasicAuthServiceFactory } from './basic-auth-factory.service';
import { Repository } from 'typeorm';
import { IUserToken } from 'src/users/types/user-token.interface';
import { TokensService } from 'src/core/services/tokens';
import { Auth } from '../entities/auth.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { KavehnegarService } from 'src/core/sdk/kavehnegar/kavehnegar.service';
import { RequiredHeaderPayload } from '../types/basic-auth.types';
import { SendOtpDto } from '../dto/send-otp.dto';
import { randomCodeGenerator } from 'src/core/helpers/random-generator.helper';
import { userKeyGenerator } from 'src/users/helpers/user-key-generator.helper';
import { TokenType } from 'src/core/types/enums/token-types.enum';
import { IAuthToken } from '../types/auth-token.interface';
import { AuthTypes } from '../types/auth-types.enum';
import { OtpCodeResponse } from '../types/core-auth.types';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class CoreAuth extends BasicAuthServiceFactory {
  constructor(
    private readonly otpService: KavehnegarService,
    tokensService: TokensService<IAuthToken>,
    @InjectRepository(Auth) authRepo: Repository<Auth>,
  ) {
    super(tokensService, authRepo);
  }

  private async sendCode(phoneNumber: string, code: string) {
    if (process.env.NODE_ENV = 'DEV') {
      Logger.debug(
        `${phoneNumber} :: ${code}`,
        CoreAuth.name
      );
      return;
    }

    await lastValueFrom(this.otpService.sendOtp({
      code,
      phoneNumber,
      templateId: process.env.OTP_TEMPLATE_ID,
    }))
  }

  public async sendOtpCode(payload: SendOtpDto, headerData: RequiredHeaderPayload): Promise<OtpCodeResponse> {
    const user = await this.findUserByPhoneNumber(payload.phoneNumber);
    const otpCode = randomCodeGenerator(4);

    const key = userKeyGenerator(payload.phoneNumber, otpCode);

    const token = await this.tokensService.getAccessToken({
      client: headerData.userAgent,
      ip: headerData.ip,
      phoneNumber: payload.phoneNumber,
      tokenType: TokenType.otpCode,
      key,
      authType: AuthTypes.core,
      id: user?.id || ''
    });

    await this.sendCode(payload.phoneNumber, otpCode);

    return {
      accessToken: token,
    }
  }

  public async verifyOtpCode(token: string | IAuthToken) {
    if (typeof token === 'string') {
      token = await this.tokensService.validate(token as string)
    }

    // TODO: Complete validation
  }

}
