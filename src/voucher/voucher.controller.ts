import { Body, Controller, Post } from '@nestjs/common';
import { VoucherService } from './voucher.service';

@Controller('voucher')
export class VoucherController {
  constructor(private readonly voucherService: VoucherService) {}

  @Post()
  create(@Body() dto: { studentId: string; discount: number }) {
    return this.voucherService.create(dto);
  }
}
