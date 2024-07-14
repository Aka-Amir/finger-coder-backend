import { Auth } from '../../@shared/entities/auth.entity';

export type OtpCodeResponse = {
  accessToken: string;
  user: Auth | null;
};
