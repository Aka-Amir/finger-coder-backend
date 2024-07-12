import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PhoneNumberDTO } from './@shared/dto/phone-number.dto';
import { Auth } from './@shared/entities/auth.entity';
import { LoginOptions } from './@shared/types/basic-auth.types';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Auth) private readonly authRepo: Repository<Auth>,
  ) {}

  public async create(user: Omit<Omit<Auth, 'id'>, 'joinedAt'>): Promise<Auth> {
    return this.authRepo.save(user);
  }

  public async findUserByPhoneNumber(phoneNumber: string): Promise<Auth> {
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

    const loginOptions = AuthService.getLoginOptions(user);
    if (!loginOptions.length) {
      loginOptions.push('auth/otp');
    }
    return loginOptions;
  }
}
