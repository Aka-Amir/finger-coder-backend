import { IsNotEmpty, Min } from 'class-validator';

export class CreatePlanDto {
  @IsNotEmpty({
    message: 'planName_is_empty',
  })
  planName: string;

  @Min(100_000, {
    message: 'minValue_100000',
  })
  priceIRT: number;

  @IsNotEmpty({
    message: 'planDescription_is_empty',
  })
  planDescription: string;

  planLogo?: string;
}
