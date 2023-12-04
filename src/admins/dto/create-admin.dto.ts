import { IsNotEmpty } from 'class-validator';

export class CreateAdminDto {
  @IsNotEmpty({
    message: 'username_empty',
  })
  username: string;

  @IsNotEmpty({
    message: 'password_empty',
  })
  password: string;

  @IsNotEmpty({
    message: 'email_empty',
  })
  email: string;
}
