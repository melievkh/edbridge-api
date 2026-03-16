import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CreatePaymentDto } from './dto/create-payment.dto';

@Controller('payment')
export class PaymentController {
  constructor(private paymentService: PaymentService) { }

  @Post()
  create(@Body() dto: CreatePaymentDto) {
    return this.paymentService.create(dto);
  }

  @Get()
  getAll() {
    return this.paymentService.getAll();
  }

  @Delete(':id')
  deletePayment(@Param('id') paymentId: string) {
    return this.paymentService.delete(paymentId);
  }
}