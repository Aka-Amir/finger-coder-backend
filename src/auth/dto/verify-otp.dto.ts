import { IsNotEmpty, Length } from 'class-validator';

export class VerifyOtpCodeDto {
  @Length(4, 4, {
    message: 'invalid_otp_code',
  })
  @IsNotEmpty({
    message: 'code_is_required',
  })
  code: string;
}
