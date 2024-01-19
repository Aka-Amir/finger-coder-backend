import {
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class MediaGuard implements CanActivate {
  constructor(private readonly fileParamName: string) {}

  private readonly validationRegexp =
    /[a-zA-Z0-9]{8}_[a-zA-Z0-9]{4}_[a-zA-Z0-9]{4}_[a-zA-Z0-9]{4}_[a-zA-Z0-9]{12}.(jpeg|jpg|png|webp)$/;

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const file = context.switchToHttp().getRequest().params[this.fileParamName];

    if (!this.validationRegexp.test(file)) throw new NotFoundException();

    return true;
  }
}
