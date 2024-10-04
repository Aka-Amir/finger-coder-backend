import { HttpService } from '@nestjs/axios';
import {
  Inject,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { catchError, map } from 'rxjs';
import { GithubSdkModuleOptions } from './types/module-registration.type';
import { GithubUserInfo } from './types/github-user-response.type';
import { GithubAccessTokenResponse } from './types/github-access-token-response.type';

@Injectable()
export class GithubService {
  constructor(
    private readonly httpService: HttpService,
    @Inject('GIT_OPT') private _options: GithubSdkModuleOptions,
  ) {}

  getAccessToken(userCode: string) {
    return this.httpService
      .get<GithubAccessTokenResponse>(
        'https://github.com/login/oauth/access_token',
        {
          params: {
            client_id: this._options.client.id,
            client_secret: this._options.client.secret,
            code: userCode,
          },
          headers: {
            Accept: 'application/json',
            'Accept-Encoding': 'application/json',
          },
        },
      )
      .pipe(
        catchError((e) => {
          console.log(e);
          throw new UnprocessableEntityException();
        }),
        map((item) => {
          return item.data;
        }),
      );
  }

  getUserData(accessToken: string) {
    return this.httpService
      .get<GithubUserInfo>(
        'https://api.github.com/user?access_token=' + accessToken,
        {
          headers: {
            Authorization: 'Bearer ' + accessToken,
            // 'X-GitHub-Api-Version': '2022-11-28',
            // Accept: 'application/vnd.github+json',
            'user-agent':
              'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/45.0.2454.85 Safari/537.36',
          },
        },
      )
      .pipe(
        catchError((e) => {
          console.log(e);
          throw new UnprocessableEntityException();
        }),
        map((item) => {
          return item.data;
        }),
      );
  }
}
