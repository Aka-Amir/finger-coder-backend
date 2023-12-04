import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
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
