import { InjectRepository } from '@nestjs/typeorm';
import { TokensService } from 'src/core/services/tokens';
import { Repository } from 'typeorm';
import { Auth } from '../entities/auth.entity';
import { IAuthToken } from '../types/auth-token.interface';
import { LoginOptions } from '../types/basic-auth.types';

export abstract class BasicAuthServiceFactory {
  constructor(
    protected readonly tokensService: TokensService<IAuthToken, IAuthToken>,
    @InjectRepository(Auth) protected readonly authRepo: Repository<Auth>,
  ) {}

  protected async findUserByPhoneNumber(phoneNumber: string): Promise<Auth> {
    const response = await this.authRepo.findOne({
      where: {
        phoneNumber,
      },
    });

    return response;
  }

  public static getLoginOptions(user: Auth | null): LoginOptions[] {
    if (user === null) {
      return [];
    }

    const loginOptions: LoginOptions[] = [];

    if (user.githubId) {
      loginOptions.push('auth/github');
    }

    if (user.googleId) {
      loginOptions.push('auth/google');
    }

    if (user.phoneNumber) {
      loginOptions.push('auth/otp');
    }

    return loginOptions;
  }

  protected findUserByEmail(email: string): Promise<Auth | null> {
    return this.authRepo.findOne({
      where: {
        email,
      },
    });
  }

  protected findById(id: string): Promise<Auth | null> {
    return this.authRepo.findOne({
      where: {
        id,
      },
    });
  }
}
