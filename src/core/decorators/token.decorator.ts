import { ExecutionContext, createParamDecorator } from '@nestjs/common';

export const TokenData = createParamDecorator(
  (key: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    if ('iat' in request.__token) {
      delete request.__token.iat;
    }
    if ('exp' in request.__token) {
      delete request.__token.exp;
    }
    if (!key) return request.__token;
    return request.__token[key];
  },
);
