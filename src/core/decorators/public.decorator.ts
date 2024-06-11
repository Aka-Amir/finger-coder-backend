import { SetMetadata } from '@nestjs/common';

export const PUBLIC_TOKEN = '__ISPUBLIC__';
export const Public = () => SetMetadata(PUBLIC_TOKEN, true);
