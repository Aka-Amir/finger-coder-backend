import { Controller, Get, Header, Query } from '@nestjs/common';
import { Public } from 'src/core/decorators/public.decorator';
import { BrowserResponse } from '../@shared/dto/browser-response.dto';
import { GithubService } from './github.service';

@Controller('auth/github')
export class GithubController {
  constructor(private readonly _service: GithubService) {}

  @Get()
  @Public()
  @Header('Content-Type', 'text/html;charset=utf-8')
  async githubLogin(@Query('code') code: string) {
    const response = await this._service.linkAccount(code);
    return new BrowserResponse({
      response,
    }).toString();
  }
}
