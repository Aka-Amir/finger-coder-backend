import {
  BadRequestException,
  Body,
  Controller,
  Headers,
  Ip,
  Post,
} from '@nestjs/common';
import { Public } from 'src/core/decorators/public.decorator';
import { TokenData } from 'src/core/decorators/token.decorator';
import { TokensService } from 'src/core/services/tokens';
import { TokenType } from 'src/core/types/enums/token-types.enum';
import { userKeyGenerator } from '../@shared/helpers/user-key.generator';
import { IAuthToken } from '../@shared/types/auth-token.interface';
import { AuthTypes } from '../@shared/types/auth-types.enum';
import { GoogleUserDto } from './dto/google-user.dto';
import { GoogleService } from './google.service';

@Controller('auth/google')
export class GoogleController {
  constructor(
    private readonly googleService: GoogleService,
    private readonly _tokenService: TokensService<IAuthToken>,
  ) {}

  @Post('link')
  async linkAccount(
    @TokenData() token: IAuthToken,
    @Body() userInfo: GoogleUserDto,
  ) {
    await this.googleService.linkAccount(token.phoneNumber, userInfo);
    return {
      message: true,
    };
  }

  @Post('login')
  @Public()
  async login(
    @Ip() ip: string,
    @Headers('user-agent') client: string,
    @Body('googleId') id: string,
  ) {
    if (!id) throw new BadRequestException();

    const userInfo = await this.googleService.login(id);
    const userKey = userKeyGenerator(userInfo.phoneNumber, id.toString());

    const accessToken = await this._tokenService.getAccessToken({
      client,
      ip,
      phoneNumber: userInfo.phoneNumber,
      tokenType: TokenType.commonUser,
      id: userInfo.id,
      authType: AuthTypes.google,
      key: userKey,
    });

    return {
      accessToken,
    };
  }
}
