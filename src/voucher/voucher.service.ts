import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { generateVoucherCode } from 'src/utils/generate-voucher-code';

@Injectable()
export class VoucherService {
  constructor(private prisma: PrismaService) { }

  async create(dto: { studentId: string, discount: number }) {
    const voucherCode = await generateVoucherCode();

    const voucher = await this.prisma.voucher.create({
      data: {
        code: voucherCode,
        studentId: dto.studentId,
        discount: dto.discount,
      },
    });

    return { data: voucher };
  }

  async checkVoucher(code: string) {
    const voucher = await this.prisma.voucher.findUnique({
      where: { code },
    });

    if (!voucher) {
      return { valid: false, message: 'Voucher not found' };
    }

    if (voucher.used) {
      return { valid: false, message: 'Voucher already used' };
    }

    return { valid: true, discount: voucher.discount };
  }

  async markVoucherAsUsed(code: string, paymentId: string) {
    const appliedAt = new Date();

    const voucher = await this.prisma.voucher.update({
      where: { code },
      data: {
        used: true,
        paymentId,
        appliedAt,
      },
    });

    return { data: voucher };
  }
}
