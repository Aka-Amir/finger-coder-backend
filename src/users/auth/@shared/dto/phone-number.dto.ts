import { IsNotEmpty, IsPhoneNumber } from 'class-validator';

export class PhoneNumberDTO {
  @IsNotEmpty({
    message: 'phoneNumber_empty',
  })
  @IsPhoneNumber('IR', {
    message: 'phoneNumber_not_valid',
  })
  phoneNumber: string;
}
