import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { ACCESS_TOKEN } from '../decorators/access.decorator';
import { TokenType } from '../types/enums/token-types.enum';
import { ITokenModel } from '../types/interfaces/tokens/token-model.interface';
import { PUBLIC_TOKEN } from '../decorators/public.decorator';

@Injectable()
export class AccessGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(PUBLIC_TOKEN, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;

    const accessList = this.reflector.getAllAndOverride<TokenType[]>(
      ACCESS_TOKEN,
      [context.getHandler(), context.getClass()],
    );

    const token = context.switchToHttp().getRequest().__token as ITokenModel;

    if (+token.tokenType === TokenType.access) return true;

    if (!accessList.includes(+token.tokenType)) throw new ForbiddenException();

    return true;
  }
}
