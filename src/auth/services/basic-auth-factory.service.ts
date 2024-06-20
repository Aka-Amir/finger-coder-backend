import { InjectRepository } from '@nestjs/typeorm';
import { TokensService } from 'src/core/services/tokens';
import { Repository } from 'typeorm';
import { Auth } from '../entities/auth.entity';
import { IAuthToken } from '../types/auth-token.interface';

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
