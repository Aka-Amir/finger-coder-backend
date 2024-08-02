import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';
import { BrowserResponse } from '../dto/browser-response.dto';

@Catch(HttpException)
export class BrowserResponseExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    let response: BrowserResponse;

    const res = host.switchToHttp().getResponse() as Response;
    const errorCode = (exception as HttpException).getStatus();
    const errorResponse = (exception as HttpException).getResponse();

    if (typeof errorResponse === 'string') {
      response = new BrowserResponse({ message: errorResponse, error: true });
    } else {
      response = new BrowserResponse({ ...errorResponse, error: true });
    }

    res.status(errorCode).send(response.toString());
  }
}
