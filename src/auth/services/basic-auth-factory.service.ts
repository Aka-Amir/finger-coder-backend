import { TokensService } from 'src/core/services/tokens';
import { IUserToken } from 'src/users/types/user-token.interface';

export abstract class BasicAuthServiceFactory {
  constructor(
    protected readonly tokensService: TokensService<IUserToken, IUserToken>,
  ) {}
}
