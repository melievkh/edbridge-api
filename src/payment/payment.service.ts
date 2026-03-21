import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePaymentDto } from './dto/create-payment.dto';

@Injectable()
export class PaymentService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreatePaymentDto) {
    const {
      studentId,
      referalStudentId,
      courseId,
      amount,
      method,
      month,
      year,
    } = dto;

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
        throw new BadRequestException(
          'Payment for this month and year already exists',
        );
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

  async getMyPaymentStatus(userId: string): Promise<CoursePaymentStatus[]> {
    const student = await this.prisma.student.findUnique({
      where: { userId },
      include: {
        courses: {
          select: {
            id: true,
            name: true,
            price: true,
          },
        },
      },
    });

    if (!student) {
      throw new BadRequestException('Student not found');
    }

    const allPayments = await this.prisma.payment.findMany({
      where: { studentId: student.id },
    });

    const now = new Date();
    const currentYear = now.getFullYear();

    const result: CoursePaymentStatus[] = [];

    for (const course of student.courses) {
      const months: MonthStatus[] = [];
      const coursePayments = allPayments.filter(
        (p) => String(p.courseId) === String(course.id),
      );

      // 🔹 eng birinchi to‘lov oyini aniqlaymiz
      const firstPaid = coursePayments.length
        ? coursePayments.reduce((prev, curr) => {
            if (curr.year < prev.year) return curr;
            if (curr.year === prev.year && curr.month < prev.month) return curr;
            return prev;
          })
        : null;

      // agar to‘lov bo‘lmasa, start oy = 1, start year = hozirgi yil
      let month = firstPaid ? firstPaid.month : 1;
      let year = firstPaid ? firstPaid.year : currentYear;

      // 🔹 end year va month: kelajak uchun, masalan currentYear oxirigacha yoki xohlasa 12 oy
      const endYear = currentYear;
      const endMonth = 12;

      while (year < endYear || (year === endYear && month <= endMonth)) {
        const paid = coursePayments.some(
          (p) => p.month === month && p.year === year,
        );

        months.push({ month, year, paid });

        month++;
        if (month > 12) {
          month = 1;
          year++;
        }
      }

      result.push({
        courseId: course.id,
        courseName: course.name,
        monthlyPrice: course.price,
        months,
      });
    }

    return result;
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

type MonthStatus = {
  month: number;
  year: number;
  paid: boolean;
};

type CoursePaymentStatus = {
  courseId: string;
  courseName: string;
  monthlyPrice: number;
  months: MonthStatus[];
};
