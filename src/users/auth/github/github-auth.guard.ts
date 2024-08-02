import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { TokensService } from 'src/core/services/tokens';
import { IAuthToken } from '../@shared/types/auth-token.interface';

@Injectable()
export class GithubAuthGuard implements CanActivate {
  constructor(private tokensService: TokensService<IAuthToken>) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest() as Request;
    const token = request.query.token as string | undefined;
    if (!token) return false;
    try {
      (request as any).__token = await this.tokensService.validate(token);
      return true;
    } catch {
      return false;
    }
  }
}
