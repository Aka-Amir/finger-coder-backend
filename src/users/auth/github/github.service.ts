import { Injectable } from '@nestjs/common';
import { lastValueFrom, mergeMap } from 'rxjs';
import { GithubService as GithubSDKService } from 'src/core/sdk/github/github.service';
import { OAuthProviders } from '../@shared/types/oauth-providers';
import { AuthService } from '../auth.service';

@Injectable()
export class GithubService {
  public readonly PROVIDER = OAuthProviders.GITHUB;

  constructor(
    private readonly _githubService: GithubSDKService,
    private readonly _authService: AuthService,
  ) {}

  private getUserData(code: string) {
    return lastValueFrom(
      this._githubService
        .getAccessToken(code)
        .pipe(
          mergeMap((data) =>
            this._githubService.getUserData(data.access_token),
          ),
        ),
    );
  }

  async login(code: string) {
    const userData = await this.getUserData(code);
    const oauthID = userData.id.toString();
    const response = await this._authService.mapUserWithOAuthId(
      oauthID,
      this.PROVIDER,
    );

    return {
      user: response,
      oauthData: userData,
    };
  }

  async linkAccount(code: string, phoneNumber: string) {
    const response = await this.getUserData(code);
    await this._authService.linkAccount(
      phoneNumber,
      response.id.toString(),
      this.PROVIDER,
    );

    return response;
  }
}
