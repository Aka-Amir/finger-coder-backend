import { IsNotEmpty } from 'class-validator';

export class CallBackResponseDTO {
  @IsNotEmpty()
  trackId: number;

  @IsNotEmpty()
  success: '1' | '0';

  orderId?: string;
  cardNumber?: string;
  hashedCardNumber?: string;
}
