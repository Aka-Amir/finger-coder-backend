import { IsNotEmpty } from 'class-validator';

export class LoginAdminDto {
  @IsNotEmpty({
    message: 'usernameOrEmail_empty',
  })
  usernameOrEmail: string;

  @IsNotEmpty({
    message: 'password_empty',
  })
  password: string;
}
