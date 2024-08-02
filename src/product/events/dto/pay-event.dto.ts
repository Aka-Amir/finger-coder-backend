import { IsNotEmpty, Min } from 'class-validator';

export class PayEventDTO {
  @IsNotEmpty({
    message: 'ticketId_empty',
  })
  @Min(1, {
    message: 'ticketId_invalid',
  })
  ticketId: number;

  offerCode?: string;
}
