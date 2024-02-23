export interface IRequestForGateway {
  amount: number;
  callBackUrl?: string;
  orderId: string;
  description?: string;
  mobile?: string;
  allowedCards?: string[];
  ledgerId?: string;
  sms?: boolean;
}
