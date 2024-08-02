export type RequiredHeaderPayload = {
  ip: string;
  userAgent: string;
};

export type LoginOptions = 'auth/github' | 'auth/google' | 'auth/otp';
