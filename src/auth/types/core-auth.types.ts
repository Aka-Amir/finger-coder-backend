import { Auth } from '../entities/auth.entity';
import { LoginOptions } from './basic-auth.types';

export type OtpCodeResponse = {
  accessToken: string;
  user: Auth | null;
  loginOptions: LoginOptions[];
};
