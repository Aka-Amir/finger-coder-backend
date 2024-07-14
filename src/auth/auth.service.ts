import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PhoneNumberDTO } from './@shared/dto/phone-number.dto';
import { Auth } from './@shared/entities/auth.entity';
import { LoginOptions } from './@shared/types/basic-auth.types';
import { OAuthID } from './@shared/entities/oauth-id.entity';
import { OAuthProviders } from './@shared/types/oauth-providers';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Auth) private readonly authRepo: Repository<Auth>,
    @InjectRepository(OAuthID) private readonly oauthRepo: Repository<OAuthID>,
  ) {}

  public async create(user: Omit<Omit<Auth, 'id'>, 'joinedAt'>): Promise<Auth> {
    return this.authRepo.save(user);
  }

  public async linkAccount(
    phoneNumber: string,
    oauthID: string,
    provider: OAuthProviders,
  ) {
    const { id } = await this.authRepo.findOne({
      where: {
        phoneNumber,
      },
      select: {
        id: true,
      },
    });

    return await this.oauthRepo.save({
      provider,
      authId: id,
      id: oauthID,
    });
  }

  public async findUserByPhoneNumber(phoneNumber: string): Promise<Auth> {
    const response = await this.authRepo.findOne({
      where: {
        phoneNumber,
      },
    });

    return response;
  }

  public findUserByEmail(email: string): Promise<Auth | null> {
    return this.authRepo.findOne({
      where: {
        email,
      },
    });
  }

  public findById(id: string): Promise<Auth | null> {
    return this.authRepo.findOne({
      where: {
        id,
      },
    });
  }

  public async queryLoginOptions(
    data: PhoneNumberDTO,
  ): Promise<LoginOptions[]> {
    const user = await this.authRepo.findOne({
      where: {
        phoneNumber: data.phoneNumber,
      },
    });

    const oauthIDs = await this.oauthRepo.find({
      where: {
        authId: user.id,
      },
      select: {
        provider: true,
      },
    });

    const loginOptions = oauthIDs.map((item) => item.provider as LoginOptions);
    if (!loginOptions.length) {
      loginOptions.push('auth/otp');
    }
    return loginOptions;
  }
}
