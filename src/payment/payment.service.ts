import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePaymentDto } from './dto/create-payment.dto';

@Injectable()
export class PaymentService {
  constructor(private prisma: PrismaService) { }

  // CREATE A PAYMENT

  async create(dto: CreatePaymentDto) {
    const { studentId, referalStudentId, courseId, amount, method, month, year } = dto;

    const student = await this.prisma.student.findUnique({ where: { id: studentId } });
    if (!student) {
      throw new BadRequestException('Student not found');
    }

    const referralStudent = await this.prisma.student.findUnique({ where: { id: referalStudentId } });
    if (!referralStudent) {
      throw new BadRequestException('Referral student not found');
    }

    const payment = await this.prisma.payment.create({
      data: {
        studentId,
        courseId,
        amount,
        method,
        month,
        year,
      },
    });

    // give referral student 5% of the payment amount as a referral bonus


    return payment;
  }
}