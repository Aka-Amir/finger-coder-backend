import { IsNotEmpty, Max, Min } from 'class-validator';

export class CreateOfferCodeDto {
  @IsNotEmpty({
    message: 'empty_id',
  })
  code: string;

  @Max(90)
  @Min(1)
  amount: number;

  userId?: number;
  eventId?: number;
}
