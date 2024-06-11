import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Auth } from './entities/auth.entity';
import { KavehnegarService } from 'src/core/sdk/kavehnegar/kavehnegar.service';
import { TokensService } from 'src/core/services/tokens';
import { IUserToken } from 'src/users/types/user-token.interface';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Auth) private readonly authRepo: Repository<Auth>,
    private readonly otpService: KavehnegarService,
    private readonly tokensService: TokensService<IUserToken, IUserToken>,
  ) {}
}
