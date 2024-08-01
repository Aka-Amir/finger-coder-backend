import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PhoneNumberDTO } from './@shared/dto/phone-number.dto';
import { Auth } from './@shared/entities/auth.entity';
import { OAuthID } from './@shared/entities/oauth-id.entity';
import { LoginOptions } from './@shared/types/basic-auth.types';
import { OAuthProviders } from './@shared/types/oauth-providers';
import { IEventPublisher } from 'src/core/types/interfaces/events/event-publisher.interface';
import { usersEvent } from 'src/@events/users/users.event';

@Injectable()
export class AuthService implements IEventPublisher {
  constructor(
    @InjectRepository(Auth) private readonly authRepo: Repository<Auth>,
    @InjectRepository(OAuthID) private readonly oauthRepo: Repository<OAuthID>,
  ) {}
  get sourceName(): string {
    return AuthService.name;
  }

  public async mapUserWithOAuthId(
    oauthID: string,
    provider: OAuthProviders,
  ): Promise<Auth> {
    const response = await this.oauthRepo.findOne({
      where: {
        providerId: oauthID,
        provider: provider,
      },
      relations: {
        auth: true,
      },
    });

    if (!response) return null;
    return response.auth as Auth;
  }

  public async create(
    user: Partial<{ email: string }> & { phoneNumber: string },
  ): Promise<Auth> {
    const createdRecord = await this.authRepo.save(user);
    usersEvent.emit(this, {
      authId: createdRecord.id,
    });
    return createdRecord;
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
      providerId: oauthID,
      auth: id,
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

  public async updateUserEmail(userId: string, email: string) {
    return this.authRepo.update(userId, {
      email,
    });
  }

  public async queryLoginOptions(
    data: PhoneNumberDTO,
  ): Promise<LoginOptions[]> {
    const user = await this.authRepo.findOne({
      where: {
        phoneNumber: data.phoneNumber,
      },
      relations: {
        oauths: true,
      },
    });

    const loginOptions: LoginOptions[] = ['auth/otp'];

    if (!user) {
      return loginOptions;
    }

    for (const item of user.oauths) {
      loginOptions.push(item.provider as LoginOptions);
    }

    return loginOptions;
  }
}
