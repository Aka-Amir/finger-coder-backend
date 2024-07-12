import { Controller, Get, Header, Query } from '@nestjs/common';
import { GithubService } from './github.service';
import { Public } from 'src/core/decorators/public.decorator';
import { BrowserResponse } from '../@shared/dto/browser-response.dto';
import { AuthService } from '../auth.service';
import { lastValueFrom } from 'rxjs';

@Controller('auth/github')
export class GithubController {
  constructor(
    private readonly _service: GithubService,
    private readonly _authService: AuthService,
  ) {}

  @Get()
  @Public()
  @Header('Content-Type', 'text/html;charset=utf-8')
  async githubLogin(@Query('code') code: string) {
    const response = await lastValueFrom(this._service.linkAccount(code));
    return new BrowserResponse({
      response,
    }).toString();
  }
}
