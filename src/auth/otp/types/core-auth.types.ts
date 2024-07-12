import { Auth } from '../../@shared/entities/auth.entity';
import { LoginOptions } from '../../@shared/types/basic-auth.types';

export type OtpCodeResponse = {
  accessToken: string;
  user: Auth | null;
  loginOptions: LoginOptions[];
};
