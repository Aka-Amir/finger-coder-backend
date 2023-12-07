import {
  CallHandler,
  ConflictException,
  ExecutionContext,
  HttpException,
  Injectable,
  InternalServerErrorException,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { QueryFailedError } from 'typeorm';

@Injectable()
export class DatabaseInterceptor implements NestInterceptor {
  errorList: Record<string, HttpException> = {
    ER_DUP_ENTRY: new ConflictException('already exists'),
  };

  intercept(_: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((e) => {
        if (e instanceof QueryFailedError) {
          console.log(e);
          const error = this.errorList[e.driverError.code];
          throw (
            error ||
            new InternalServerErrorException(
              `Not implemeneted database error ${e.message}`,
            )
          );
        }

        throw e;
      }),
    );
  }
}
