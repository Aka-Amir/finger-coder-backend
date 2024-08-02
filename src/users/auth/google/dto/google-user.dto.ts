import { Equals, IsBoolean, IsNotEmpty } from 'class-validator';

export class GoogleUserDto {
  @IsNotEmpty()
  id: string;

  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  @IsBoolean()
  @Equals(true)
  verified_email: boolean;

  @IsNotEmpty()
  name: string;

  given_name?: string;

  picture?: string;
}
