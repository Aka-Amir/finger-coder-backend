import { Body, Controller, Post } from '@nestjs/common';
import { GoogleService } from './google.service';
import { TokenData } from 'src/core/decorators/token.decorator';
import { IAuthToken } from '../@shared/types/auth-token.interface';

@Controller('auth/google')
export class GoogleController {
  constructor(private readonly googleService: GoogleService) {}

  @Post('link')
  async linkAccount(
    @TokenData() token: IAuthToken,
    @Body('googleToken') googleToken: string,
  ) {
    await this.googleService.linkAccount(googleToken, token.phoneNumber);
    return {
      message: true,
    };
  }
}
