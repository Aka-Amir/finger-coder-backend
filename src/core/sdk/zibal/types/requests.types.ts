export interface IRequestForGateway {
  amount: number;
  callBackUrl: string;
  description?: string;
  orderId?: string;
  mobile?: string;
  allowedCards?: string[];
  ledgerId?: string;
  sms?: boolean;
}
