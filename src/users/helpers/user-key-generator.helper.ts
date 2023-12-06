import { createHash } from 'crypto';

export function userKeyGenerator(phoneNumber: string, code: string): string {
  return createHash('MD5').update(`${phoneNumber}_${code}`).digest('hex');
}
