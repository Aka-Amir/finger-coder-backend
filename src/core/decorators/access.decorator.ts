import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { TokenType } from '../types/enums/token-types.enum';
import { AccessGuard } from '../guards/access.guard';

export const ACCESS_TOKEN = 'ACCESS_TOKEN';
export const Access = (...tokenType: TokenType[]) =>
  applyDecorators(SetMetadata(ACCESS_TOKEN, tokenType), UseGuards(AccessGuard));
