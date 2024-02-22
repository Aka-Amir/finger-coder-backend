import { ResultCodes } from './result-codes.enum';
import { StatusCode } from './status-codes.enum';

export interface IGatewayResponse {
  trackId: number;
  result: ResultCodes;
  message: string;
  payLink?: string;
}

export interface IVerifyResponse {
  paidAt: Date;
  amount: number;
  result: ResultCodes;
  status: StatusCode;
  refNumber: number;
  description: string;
  cardNumber: string;
  orderId: string;
  message: string;
}
