import { Injectable } from '@nestjs/common';
import { lastValueFrom, mergeMap } from 'rxjs';
import { GithubService as GithubSDKService } from 'src/core/sdk/github/github.service';
import { AuthService } from '../auth.service';

@Injectable()
export class GithubService {
  constructor(
    private readonly _githubService: GithubSDKService,
    private readonly _authService: AuthService,
  ) {}

  async linkAccount(code: string) {
    const response = await lastValueFrom(
      this._githubService
        .getAccessToken(code)
        .pipe(
          mergeMap((data) =>
            this._githubService.getUserData(data.access_token),
          ),
        ),
    );

    console.log(response);
    return response;
  }
}
