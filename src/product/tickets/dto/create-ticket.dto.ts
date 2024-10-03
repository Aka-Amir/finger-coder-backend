import { Min, IsNotEmpty } from 'class-validator';

export class CreateTicketDto {
  @IsNotEmpty({
    message: 'title_empty',
  })
  title: string;

  @Min(1, {
    // message: 'priceIRT_low',
    message(validationArguments) {
      return JSON.stringify(validationArguments);
    },
  })
  priceIRT: number;

  @Min(1, {
    message: 'amount_low',
  })
  amount: number;

  description?: string;
  disableAt?: string | Date;
  isDisabled?: boolean;
}
