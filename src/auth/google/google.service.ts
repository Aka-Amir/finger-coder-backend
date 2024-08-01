import { Injectable } from '@nestjs/common';
import { OAuthProviders } from '../@shared/types/oauth-providers';
import { AuthService } from '../auth.service';
import { GoogleUserDto } from './dto/google-user.dto';

@Injectable()
export class GoogleService {
  constructor(private readonly _authService: AuthService) {}

  async linkAccount(phoneNumber: string, user: GoogleUserDto) {
    const response = await this._authService.linkAccount(
      phoneNumber,
      user.id,
      OAuthProviders.GOOGLE,
    );
    const userId = response.auth as string;
    this._authService.updateUserEmail(userId, user.email);
    return response;
  }

  async login(googleId: string) {
    const response = this._authService.mapUserWithOAuthId(
      googleId,
      OAuthProviders.GOOGLE,
    );

    return response;
  }
}
