import { Controller, Get, Headers, Post } from '@nestjs/common';
import { PaymentsService } from './payments.service';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Get()
  test(@Headers('api-key') headers: string) {
    console.log(headers);
    return 'Hello wrld ';
  }

  @Post()
  payment() {
    return {
      message: 'payment',
    };
  }
}
