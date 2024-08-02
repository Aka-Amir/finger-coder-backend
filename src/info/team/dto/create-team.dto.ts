import { IsNotEmpty } from 'class-validator';

export class CreateTeamDto {
  @IsNotEmpty()
  role: string;

  @IsNotEmpty()
  fullName: string;

  profileImage?: string;
  description?: string;
}
