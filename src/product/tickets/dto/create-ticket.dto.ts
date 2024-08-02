import { Min, IsNotEmpty } from 'class-validator';

export class CreateTicketDto {
  @IsNotEmpty({
    message: 'title_empty',
  })
  title: string;

  @Min(0, {
    message: 'priceIRT_low',
  })
  priceIRT: number;

  @Min(0, {
    message: 'amount_low',
  })
  amount: number;

  description?: string;
  disableAt?: string | Date;
  isDisabled?: boolean;
}
