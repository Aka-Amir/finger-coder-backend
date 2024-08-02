import { Inject, Injectable, Logger } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';
import { randomCodeGenerator } from 'src/core/helpers/random-generator.helper';
import { KavehnegarService } from 'src/core/sdk/kavehnegar/kavehnegar.service';
import { TokensService } from 'src/core/services/tokens';
import { TokenType } from 'src/core/types/enums/token-types.enum';
import { userKeyGenerator } from '../@shared/helpers/user-key.generator';
import { AuthService } from '../auth.service';
import { SendOtpDto } from './dto/send-otp.dto';
import { Auth } from '../@shared/entities/auth.entity';
import { InvalidClientException } from './errors/invalid-client.exception';
import { InvalidOtpCodeException } from './errors/invalid-code.exception';
import { IAuthToken } from '../@shared/types/auth-token.interface';
import { AuthTypes } from '../@shared/types/auth-types.enum';
import { RequiredHeaderPayload } from '../@shared/types/basic-auth.types';
import { OtpCodeResponse } from './types/core-auth.types';

@Injectable()
export class OtpService {
  constructor(
    private readonly otpService: KavehnegarService,
    @Inject(TokensService<IAuthToken>)
    private tokensService: TokensService<IAuthToken>,
    private readonly authService: AuthService,
  ) {}

  private async sendCode(phoneNumber: string, code: string) {
    if ((process.env.NODE_ENV = 'DEV')) {
      Logger.debug(`${phoneNumber} :: ${code}`, OtpService.name);
      return;
    }

    await lastValueFrom(
      this.otpService.sendOtp({
        code,
        phoneNumber,
        templateId: process.env.OTP_TEMPLATE_ID,
      }),
    );
  }

  public async sendOtpCode(
    payload: SendOtpDto,
    headerData: RequiredHeaderPayload,
  ): Promise<OtpCodeResponse> {
    const user = await this.authService.findUserByPhoneNumber(
      payload.phoneNumber,
    );
    const otpCode = randomCodeGenerator(4);

    const key = userKeyGenerator(payload.phoneNumber, otpCode);

    const token = await this.tokensService.getAccessToken({
      client: headerData.userAgent,
      ip: headerData.ip,
      phoneNumber: payload.phoneNumber,
      tokenType: TokenType.otpCode,
      key,
      authType: AuthTypes.core,
      id: user?.id || '',
    });

    await this.sendCode(payload.phoneNumber, otpCode);

    return {
      accessToken: token,
      user,
    };
  }

  public async verifyOtpCode(
    headerData: RequiredHeaderPayload,
    token: string | IAuthToken,
    code: string,
  ) {
    if (typeof token === 'string') {
      token = await this.tokensService.validate(token as string);
    }

    const expectedKey = userKeyGenerator(token.phoneNumber, code);
    if (expectedKey !== token.key) {
      throw new InvalidOtpCodeException();
    }

    if (token.ip !== headerData.ip || token.client !== headerData.userAgent) {
      throw new InvalidClientException();
    }

    let id: string | undefined = token.id;

    if (!id) {
      const response = await this.authService.create({
        phoneNumber: token.phoneNumber,
      });
      id = response.id;
    }

    const newToken = await this.createAccessToken(
      {
        id,
        phoneNumber: token.phoneNumber,
      },
      headerData,
    );

    return {
      accessToken: newToken,
    };
  }

  private createAccessToken(
    user: Pick<Auth, 'phoneNumber' | 'id'>,
    headerData: RequiredHeaderPayload,
  ) {
    return this.tokensService.getAccessToken({
      authType: AuthTypes.core,
      client: headerData.userAgent,
      id: user.id,
      ip: headerData.ip,
      key: userKeyGenerator(user.phoneNumber, user.id),
      phoneNumber: user.phoneNumber,
      tokenType: TokenType.commonUser,
    });
  }
}
