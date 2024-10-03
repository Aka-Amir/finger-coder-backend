import { IsNotEmpty } from 'class-validator';

export class CreateEventDto {
  @IsNotEmpty()
  startDate: number;

  @IsNotEmpty()
  posterPath: string;

  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  lecturer: string;

  @IsNotEmpty()
  heading: string;

  @IsNotEmpty()
  place: string;

  @IsNotEmpty()
  description: string;

  metaTags?: string[];
  discount?: number;
}
