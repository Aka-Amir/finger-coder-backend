import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Header,
  Headers,
  HttpCode,
  Ip,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { Access } from 'src/core/decorators/access.decorator';
import { Public } from 'src/core/decorators/public.decorator';
import { TokenData } from 'src/core/decorators/token.decorator';
import { AccessGuard } from 'src/core/guards/access.guard';
import { TokenType } from 'src/core/types/enums/token-types.enum';
import { AuthService } from './auth.service';
import { SendOtpDto } from './dto/send-otp.dto';
import { VerifyOtpCodeDto } from './dto/verify-otp.dto';
import { InvalidOtpCodeException } from './errors/invalid-code.exception';
import { IAuthToken } from './types/auth-token.interface';
import { BrowserResponse } from './dto/browser-response.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly service: AuthService) {}

  @Get('options')
  @Public()
  async getLoginOptions(@Query() payload: SendOtpDto) {
    return this.service.queryLoginOptions(payload);
  }

  @Post('otp')
  @HttpCode(200)
  @Public()
  async sendOtpToUser(
    @Body() data: SendOtpDto,
    @Headers('user-agent') client: string,
    @Ip() ip: string,
  ) {
    const response = await this.service.core.sendOtpCode(data, {
      ip,
      userAgent: client,
    });

    return {
      token: response.accessToken,
      loginOptions: response.loginOptions,
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
    return this.service.core
      .verifyOtpCode({ ip, userAgent: client }, token, data.code)
      .catch((e) => {
        if (e instanceof InvalidOtpCodeException) {
          throw new BadRequestException();
        }
      });
  }

  @Get('github')
  @Public()
  @Header('Content-Type', 'text/html;charset=utf-8')
  async githubLogin(@Query('code') code: string) {
    return new BrowserResponse({
      code,
    }).toString();
  }
}
