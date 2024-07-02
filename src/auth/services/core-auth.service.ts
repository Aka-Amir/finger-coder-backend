import { Inject, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { lastValueFrom } from 'rxjs';
import { randomCodeGenerator } from 'src/core/helpers/random-generator.helper';
import { KavehnegarService } from 'src/core/sdk/kavehnegar/kavehnegar.service';
import { TokensService } from 'src/core/services/tokens';
import { TokenType } from 'src/core/types/enums/token-types.enum';
import { userKeyGenerator } from 'src/users/helpers/user-key-generator.helper';
import { Repository } from 'typeorm';
import { SendOtpDto } from '../dto/send-otp.dto';
import { Auth } from '../entities/auth.entity';
import { InvalidClientException } from '../errors/invalid-client.exception';
import { InvalidOtpCodeException } from '../errors/invalid-code.exception';
import { IAuthToken } from '../types/auth-token.interface';
import { AuthTypes } from '../types/auth-types.enum';
import { RequiredHeaderPayload } from '../types/basic-auth.types';
import { OtpCodeResponse } from '../types/core-auth.types';
import { BasicAuthServiceFactory } from './basic-auth-factory.service';

@Injectable()
export class CoreAuthentication extends BasicAuthServiceFactory {
  constructor(
    private readonly otpService: KavehnegarService,
    @Inject(TokensService<IAuthToken>) tokensService: TokensService<IAuthToken>,
    @InjectRepository(Auth) authRepo: Repository<Auth>,
  ) {
    super(tokensService, authRepo);
  }

  private async sendCode(phoneNumber: string, code: string) {
    if ((process.env.NODE_ENV = 'DEV')) {
      Logger.debug(`${phoneNumber} :: ${code}`, CoreAuthentication.name);
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
    const user = await this.findUserByPhoneNumber(payload.phoneNumber);
    const loginOptions = BasicAuthServiceFactory.getLoginOptions(user);
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
      loginOptions,
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
      const response = await this.authRepo.save({
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
