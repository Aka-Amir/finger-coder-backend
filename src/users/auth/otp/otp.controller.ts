import {
  BadRequestException,
  Body,
  Controller,
  Headers,
  HttpCode,
  Ip,
  Post,
} from '@nestjs/common';
import { Access } from 'src/core/decorators/access.decorator';
import { Public } from 'src/core/decorators/public.decorator';
import { TokenData } from 'src/core/decorators/token.decorator';
import { TokenType } from 'src/core/types/enums/token-types.enum';
import { IAuthToken } from '../@shared/types/auth-token.interface';
import { SendOtpDto } from './dto/send-otp.dto';
import { VerifyOtpCodeDto } from './dto/verify-otp.dto';
import { InvalidOtpCodeException } from './errors/invalid-code.exception';
import { OtpService } from './otp.service';

@Controller('auth/otp')
export class OtpController {
  constructor(private readonly service: OtpService) {}

  @Post()
  @HttpCode(200)
  @Public()
  async sendOtpToUser(
    @Body() data: SendOtpDto,
    @Headers('user-agent') client: string,
    @Ip() ip: string,
  ) {
    const response = await this.service.sendOtpCode(data, {
      ip,
      userAgent: client,
    });

    return {
      token: response.accessToken,
    };
  }

  @Post('verify')
  @Access(TokenType.otpCode)
  // @UseGuards(AccessGuard)
  async verfiy(
    @Body() data: VerifyOtpCodeDto,
    @TokenData() token: IAuthToken,
    @Ip() ip: string,
    @Headers('user-agent') client: string,
  ) {
    return this.service
      .verifyOtpCode({ ip, userAgent: client }, token, data.code)
      .catch((e) => {
        if (e instanceof InvalidOtpCodeException) {
          throw new BadRequestException();
        }
      });
  }
}
