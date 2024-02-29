import { SetMetadata } from '@nestjs/common';
import { TokenType } from '../types/enums/token-types.enum';

export const ACCESS_TOKEN = 'ACCESS_TOKEN';
export const Access = (...tokenType: TokenType[]) =>
  SetMetadata(ACCESS_TOKEN, tokenType);
