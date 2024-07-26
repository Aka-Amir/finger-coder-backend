import { Injectable } from '@nestjs/common';
import { GoogleSDKService } from 'src/core/sdk/google/google.service';
import { AuthService } from '../auth.service';
import { lastValueFrom } from 'rxjs';
import { OAuthProviders } from '../@shared/types/oauth-providers';

@Injectable()
export class GoogleService {
  constructor(
    private readonly _googleService: GoogleSDKService,
    private readonly _authService: AuthService,
  ) {}

  async linkAccount(phoneNumber: string, googleToken: string) {
    const response = await lastValueFrom(
      this._googleService.getUserInfo(googleToken),
    );

    return this._authService.linkAccount(
      phoneNumber,
      response.id,
      OAuthProviders.GOOGLE,
    );
  }
}
