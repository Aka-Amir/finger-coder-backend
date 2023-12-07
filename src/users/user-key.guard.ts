import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Request } from 'express';
import { userKeyGenerator } from './helpers/user-key-generator.helper';
import { IUserToken } from './types/user-token.interface';

@Injectable()
export class UserKeyGuard<T extends object = Record<string, unknown>>
  implements CanActivate
{
  constructor(
    private readonly phoneNumberKey: keyof T,
    private readonly otpCodeKey: keyof T,
  ) {}

  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();

    const token = request.__token as IUserToken;

    const phoneNumber = (request as Request).body[this.phoneNumberKey];
    const otpCode = (request as Request).body[this.otpCodeKey];

    const userKey = userKeyGenerator(phoneNumber, otpCode);

    if (token.userKey !== userKey) {
      throw new ForbiddenException();
    }

    return true;
  }
}
