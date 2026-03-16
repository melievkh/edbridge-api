import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePaymentDto } from './dto/create-payment.dto';

@Injectable()
export class PaymentService {
  constructor(private prisma: PrismaService) { }

  async create(dto: CreatePaymentDto) {
    const { studentId, referalStudentId, courseId, amount, method, month, year } = dto;

    return this.prisma.$transaction(async (tx) => {

      const student = await tx.student.findUnique({
        where: { id: studentId },
      });

      if (!student) {
        throw new BadRequestException('Student not found');
      }

      // check if course is exist
      const course = await tx.course.findUnique({
        where: { id: courseId },
      });

      if (!course) {
        throw new BadRequestException('Course not found');
      }

      // check if payment for the month and year already exists
      const existingPayment = await tx.payment.findFirst({
        where: {
          studentId,
          courseId,
          month,
          year,
        },
      });

      if (existingPayment) {
        throw new BadRequestException('Payment for this month and year already exists');
      }

      // create payment
      const payment = await tx.payment.create({
        data: {
          studentId,
          courseId,
          amount,
          method,
          month,
          year,
        },
      });

      // add coins to the referal student
      if (referalStudentId) {
        const referalStudent = await tx.student.findUnique({
          where: { id: referalStudentId },
          include: { user: true },
        });

        if (referalStudent) {
          await tx.user.update({
            where: { id: referalStudent.userId },
            data: {
              coins: {
                increment: 10,
              },
            },
          });
        }
      }

      return { data: payment, message: 'Payment created successfully' };
    });
  }

  async getAll() {
    const payments = await this.prisma.payment.findMany({
      include: { student: { include: { user: true } }, course: true },
    });

    return { data: payments };
  }

  async delete(paymentId: string) {
    const payment = await this.prisma.payment.findUnique({
      where: { id: paymentId },
    });

    if (!payment) {
      throw new BadRequestException('Payment not found');
    }

    await this.prisma.payment.delete({
      where: { id: paymentId },
    });

    return { message: 'Payment deleted successfully' };
  }
}