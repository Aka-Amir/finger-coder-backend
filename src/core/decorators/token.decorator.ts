import { ExecutionContext, createParamDecorator } from '@nestjs/common';

export function TokenData<T>(key?: string) {
  return createParamDecorator((_: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    if (!key) return request.__token as T;
    return request.__token[key] as T;
  });
}
