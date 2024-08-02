import { Controller, Get, Query } from '@nestjs/common';
import { Public } from 'src/core/decorators/public.decorator';
import { PhoneNumberDTO } from './@shared/dto/phone-number.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly service: AuthService) {}

  @Get('options')
  @Public()
  async getLoginOptions(@Query() payload: PhoneNumberDTO) {
    return this.service.queryLoginOptions(payload);
  }
}
