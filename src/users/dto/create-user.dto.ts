import { IsEnum, IsNotEmpty } from 'class-validator';
import { Genders } from '../../core/types/enums/gender.enum';
import { HowWeMet } from '../../core/types/enums/how-we-met.enum';

export class CreateUserDto {
  @IsNotEmpty({
    message: 'phoneNumber_empty',
  })
  phoneNumber: string;

  @IsNotEmpty({
    message: 'firstName_empty',
  })
  firstName: string;

  @IsNotEmpty({
    message: 'lastName_empty',
  })
  lastName: string;

  @IsEnum(HowWeMet, {
    message: 'howWeMet_empty',
  })
  howWeMet: HowWeMet;

  about?: string;

  @IsEnum(Genders, {
    message: 'gender_empty',
  })
  gender: Genders;
}
