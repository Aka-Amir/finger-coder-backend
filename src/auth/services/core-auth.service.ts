import { Injectable } from '@nestjs/common';
import { BasicAuthServiceFactory } from './basic-auth-factory.service';

@Injectable()
export class CoreAuth extends BasicAuthServiceFactory {}
