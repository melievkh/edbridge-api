import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { generateVoucherCode } from 'src/utils/generate-voucher-code';

@Injectable()
export class VoucherService {
  constructor(private prisma: PrismaService) {}

  async create(dto: { studentId: string; discount: number }) {
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
}
