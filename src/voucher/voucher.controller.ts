import { Body, Controller, Post } from '@nestjs/common';
import { VoucherService } from './voucher.service';

@Controller('voucher')
export class VoucherController {
  constructor(private readonly voucherService: VoucherService) { }

  @Post()
  create(@Body() dto: { studentId: string, discount: number }) {
    return this.voucherService.create(dto);
  }

  @Post('check')
  check(@Body() body: { code: string }) {
    return this.voucherService.checkVoucher(body.code);
  }

  @Post('mark-used')
  markUsed(@Body() body: { code: string, paymentId: string }) {
    return this.voucherService.markVoucherAsUsed(body.code, body.paymentId);
  }
}
