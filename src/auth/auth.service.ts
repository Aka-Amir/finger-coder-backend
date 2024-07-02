import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Auth } from './entities/auth.entity';
import { CoreAuthentication } from './services/core-auth.service';
import { GoogleAuthentication } from './services/google-auth.service';
import { GithubAuthentication } from './services/github-auth.service';
import { LoginOptions } from './types/basic-auth.types';
import { BasicAuthServiceFactory } from './services/basic-auth-factory.service';
import { SendOtpDto } from './dto/send-otp.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Auth) private readonly authRepo: Repository<Auth>,
    public readonly core: CoreAuthentication,
    public readonly githubOAuth: GithubAuthentication,
    public readonly googleOAuth: GoogleAuthentication,
  ) {}

  public async queryLoginOptions(data: SendOtpDto): Promise<LoginOptions[]> {
    const user = await this.authRepo.findOne({
      where: {
        phoneNumber: data.phoneNumber,
      },
    });

    const loginOptions = BasicAuthServiceFactory.getLoginOptions(user);
    if (!loginOptions.length) {
      loginOptions.push('auth/otp');
    }
    return loginOptions;
  }
}
