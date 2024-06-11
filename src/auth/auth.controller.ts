import {
  Headers,
  Body,
  Controller,
  HttpCode,
  Logger,
  Post,
  Ip,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { KavehnegarService } from 'src/core/sdk/kavehnegar/kavehnegar.service';
import { lastValueFrom } from 'rxjs';
import { TokenType } from 'src/core/types/enums/token-types.enum';
import { Public } from 'src/core/decorators/public.decorator';
import { SendOtpDto } from 'src/users/dto/send-otp.dto';
import { randomCodeGenerator } from 'src/core/helpers/random-generator.helper';
import { userKeyGenerator } from 'src/users/helpers/user-key-generator.helper';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly otpService: KavehnegarService,
  ) {}

  @Post('otp')
  @HttpCode(200)
  @Public()
  async sendOtpToUser(
    @Body() data: SendOtpDto,
    @Headers('user-agent') client: string,
    @Ip() ip: string,
  ) {
    const user = await this.usersService.findByPhoneNumber(data.phoneNumber);
    const otpCode = randomCodeGenerator(4);

    const userKey = userKeyGenerator(data.phoneNumber, otpCode);
    const userSign = !user?.id
      ? undefined
      : userKeyGenerator(data.phoneNumber, user.id.toString());

    const accessToken = await this.authService.getAccessToken({
      client,
      ip,
      id: user?.id || undefined,
      userKey,
      phoneNumber: data.phoneNumber,
      tokenType: TokenType.otpCode,
      userSign,
    });

    if (process.env.NODE_ENV === 'DEV') {
      Logger.debug(
        `${user?.phoneNumber || data.phoneNumber} :: ${otpCode}`,
        UsersController.name,
      );
    } else {
      await lastValueFrom(
        this.otpService.sendOtp({
          code: otpCode,
          phoneNumber: user?.phoneNumber || data.phoneNumber,
          templateId: process.env.OTP_TEMPLATE_ID,
        }),
      );
    }

    return {
      code: 'CODE_SENT',
      user,
      accessToken,
    };
  }

  @Post('verify')
  @Access(TokenType.otpCode)
  @UseGuards(AccessGuard, new UserKeyGuard<OtpVerifyDto>('phoneNumber', 'code'))
  async verfiy(@TokenData() token: IUserToken) {
    delete (token as any).exp;
    delete (token as any).iat;
    const accessToken = await this.authService.getAccessToken({
      ...token,
      tokenType: TokenType.commonUser,
    });

    return {
      code: 'USER_LOGGED_IN',
      accessToken,
    };
  }
}
