import {
  Controller,
  Get,
  Header,
  Ip,
  Headers,
  Query,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { Public } from 'src/core/decorators/public.decorator';
import { TokensService } from 'src/core/services/tokens';
import { BrowserResponse } from '../@shared/dto/browser-response.dto';
import { BrowserResponseExceptionFilter } from '../@shared/filters/browser-response-exception.filter';
import { IAuthToken } from '../@shared/types/auth-token.interface';
import { AuthTypes } from '../@shared/types/auth-types.enum';
import { GithubService } from './github.service';
import { GithubAuthGuard } from './github-auth.guard';
import { TokenData } from 'src/core/decorators/token.decorator';
import { userKeyGenerator } from 'src/users/helpers/user-key-generator.helper';
import { TokenType } from 'src/core/types/enums/token-types.enum';

@Public()
@Controller('auth/github')
@UseFilters(BrowserResponseExceptionFilter)
export class GithubController {
  constructor(
    private readonly _service: GithubService,
    private readonly _tokenService: TokensService<IAuthToken>,
  ) {}

  @Get()
  @Header('Content-Type', 'text/html;charset=utf-8')
  async githubLogin(
    @Query('code') code: string,
    @Ip() ip: string,
    @Headers('user-agent') client: string,
  ) {
    const response = await this._service.login(code);
    const accessToken = await this._tokenService.getAccessToken({
      authType: AuthTypes.github,
      client,
      ip,
      id: response.user.id,
      phoneNumber: response.user.phoneNumber,
      key: userKeyGenerator(
        response.user.phoneNumber,
        response.oauthData.id.toString(),
      ),
      tokenType: TokenType.access,
    });
    return new BrowserResponse({
      accessToken,
    }).toString();
  }

  @Get('link')
  @Header('Content-Type', 'text/html;charset=utf-8')
  @UseGuards(GithubAuthGuard)
  async linkGithubAccount(
    @Query('code') code: string,
    @TokenData() userData: IAuthToken,
  ) {
    await this._service.linkAccount(code, userData.phoneNumber);
    const accessToken = await this._tokenService.getAccessToken({
      ...userData,
      authType: AuthTypes.github,
    });
    return new BrowserResponse({
      accessToken,
    }).toString();
  }
}
