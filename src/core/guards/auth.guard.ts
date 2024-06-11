import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { TokensService } from '../services/tokens';
import { Reflector } from '@nestjs/core';
import { PUBLIC_TOKEN } from '../decorators/public.decorator';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly authService: TokensService,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(PUBLIC_TOKEN, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) return true;

    const request = context.switchToHttp().getRequest();
    const authToken = request.headers.authorization as string;

    if (!authToken) {
      throw new UnauthorizedException();
    }

    const [tokenType, token] = authToken.split(' ');

    if (tokenType !== 'Bearer') {
      throw new BadRequestException();
    }

    try {
      const tokenPayload = await this.authService.validate(token);
      request.__token = tokenPayload;
      return true;
    } catch (error) {
      Logger.error(error, AuthGuard.name);
      throw new UnauthorizedException();
    }
  }
}
