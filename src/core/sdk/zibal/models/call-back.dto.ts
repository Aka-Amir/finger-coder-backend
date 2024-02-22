import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { StatusCode } from '../types/status-codes.enum';

export class CallBackResponseDTO {
  @IsNotEmpty()
  trackId: number;

  @IsNotEmpty()
  success: 1 | 0;

  @IsNotEmpty()
  @IsString()
  orderId: string;

  @IsNotEmpty()
  @IsEnum(StatusCode)
  status: StatusCode;
}
