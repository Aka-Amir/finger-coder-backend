import { Injectable } from '@nestjs/common';
import { mergeMap } from 'rxjs';
import { GithubService as GithubSDKService } from 'src/core/sdk/github/github.service';

@Injectable()
export class GithubService {
  constructor(private readonly _githubService: GithubSDKService) {}

  linkAccount(code: string) {
    return this._githubService
      .getAccessToken(code)
      .pipe(
        mergeMap((data) => this._githubService.getUserData(data.access_token)),
      );
  }
}
