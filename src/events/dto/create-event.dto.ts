import { IsNotEmpty, Min } from 'class-validator';

export class CreateEventDto {
  @IsNotEmpty()
  startDate: number;

  @IsNotEmpty()
  @Min(1000)
  price: number;

  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  description: string;

  metaTags?: string[];
  discount?: number;
  limit?: number;
}
