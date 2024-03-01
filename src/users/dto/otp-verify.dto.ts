import { IsNotEmpty, MaxLength, MinLength } from 'class-validator';

export class OtpVerifyDto {
  @IsNotEmpty({
    message: 'code_empty',
  })
  @MinLength(4)
  @MaxLength(4)
  code: string;

  @IsNotEmpty({
    message: 'phoneNumber_empty',
  })
  phoneNumber: string;
}
