import { IsNotEmpty } from 'class-validator';

export class CreateSponserDto {
  @IsNotEmpty({
    message: 'clientName_is_empty',
  })
  clientName: string;

  @IsNotEmpty({
    message: 'sponseringReason_is_empty',
  })
  sponseringReason: string;

  @IsNotEmpty({
    message: 'clientName_is_empty',
  })
  sponserEmail: string;

  sponsershipPriceIRT: number;
  selectedPlan?: string;
}
