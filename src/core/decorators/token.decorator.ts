import { ExecutionContext, createParamDecorator } from '@nestjs/common';

export const TokenData = createParamDecorator(
  (key: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    if (!key) return request.__token;
    return request.__token[key];
  },
);
