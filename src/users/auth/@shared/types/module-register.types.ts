import { DynamicModule, ForwardReference, Type } from '@nestjs/common';

export type AuthenticationRequiredModules =
  | Type<any>
  | DynamicModule
  | Promise<DynamicModule>
  | ForwardReference<any>;
