import {
  Body,
  Controller,
  Headers,
  HttpCode,
  Ip,
  Post,
  UseGuards,
} from '@nestjs/common';
import { Public } from 'src/core/decorators/public.decorator';
import { TokenType } from 'src/core/types/enums/token-types.enum';
import { SendOtpDto } from './dto/send-otp.dto';
import { CoreAuth } from './services/core-auth.service';
import { Access } from 'src/core/decorators/access.decorator';
import { AccessGuard } from 'src/core/guards/access.guard';
import { TokenData } from 'src/core/decorators/token.decorator';
import { IAuthToken } from './types/auth-token.interface';
import { VerifyOtpCodeDto } from './dto/verify-otp.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly coreAuthService: CoreAuth) {}

  @Post('otp')
  @HttpCode(200)
  @Public()
  async sendOtpToUser(
    @Body() data: SendOtpDto,
    @Headers('user-agent') client: string,
    @Ip() ip: string,
  ) {
    const response = await this.coreAuthService.sendOtpCode(data, {
      ip,
      userAgent: client,
    });

    const loginOptions = [];

    if (response.user.githubId) {
      loginOptions.push('auth/github');
    }

    if (response.user.googleId) {
      loginOptions.push('auth/google');
    }

    return {
      token: response.accessToken,
      loginOptions,
    };
  }

  @Post('verify')
  @Access(TokenType.otpCode)
  @UseGuards(AccessGuard)
  async verfiy(
    @Body() data: VerifyOtpCodeDto,
    @TokenData() token: IAuthToken,
    @Ip() ip: string,
    @Headers('user-agent') client: string,
  ) {
    return this.coreAuthService.verifyOtpCode(
      { ip, userAgent: client },
      token,
      data.code,
    );
  }
}
