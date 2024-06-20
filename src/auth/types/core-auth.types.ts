import { Auth } from '../entities/auth.entity';

export type OtpCodeResponse = {
  accessToken: string;
  user: Auth | null;
};
