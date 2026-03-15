import * as bcrypt from 'bcrypt';
import { Injectable, BadRequestException, HttpException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { generateReferralCode } from 'src/utils/generate-referral.util';
import { generateUniqueLogin } from 'src/utils/generate-login.util';

@Injectable()
export class StudentService {
  constructor(private prisma: PrismaService) { }

  // CREATE A STUDENT

  async create(dto: CreateStudentDto) {
    const existingUser = await this.prisma.user.findFirst({
      where: { phone1: dto.phone1 },
    });

    if (existingUser)
      throw new BadRequestException('User with the same phone already exists');

    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const login = await generateUniqueLogin(this.prisma);

    const result = await this.prisma.$transaction(async (tx) => {
      const newUser = await tx.user.create({
        data: {
          login,
          password: hashedPassword,
          fullname: dto.fullname,
          role: 'STUDENT',
          birthDate: dto.birthDate,
          phone1: dto.phone1,
          phone2: dto.phone2,
        },
      });

      const student = await tx.student.create({
        data: {
          userId: newUser.id,
          referralCode: generateReferralCode(),
          groupId: dto.groupId || null,
        },
      });

      return { newUser, student };
    });

    return { data: result.newUser.login };
  }

  // GET ALL STUDENTS

  async getAll() {
    const students = await this.prisma.student.findMany({
      include: { user: true, group: true, attendance: true, payments: true, vouchers: true },
    });

    return { data: students };
  }

  // UPDATE A STUDENT

  async update(studentId: string, dto: UpdateStudentDto) {
    const student = await this.prisma.student.findUnique({
      where: { id: studentId },
    });

    if (!student) {
      throw new BadRequestException('Student not found');
    }

    const updatedUser = await this.prisma.user.update({
      where: { id: student.userId },
      data: {
        ...(dto.phone1 !== undefined && { phone1: dto.phone1 }),
        ...(dto.phone2 !== undefined && { phone2: dto.phone2 }),
        ...(dto.fullname !== undefined && { fullname: dto.fullname }),
        ...(dto.birthDate !== undefined && { birthDate: dto.birthDate }),
      },
    });

    return { data: updatedUser };
  }

  // DELETE A STUDENT

  async delete(studentId: string) {
    const student = await this.prisma.student.findUnique({
      where: { id: studentId },
    });

    if (!student) {
      throw new BadRequestException('Student not found');
    }

    await this.prisma.$transaction([
      this.prisma.student.delete({
        where: { id: studentId },
      }),
      this.prisma.user.delete({
        where: { id: student.userId },
      }),
    ]);

    return { message: 'Student deleted successfully' };
  }


  // ASSIGN STUDENT TO GROUP

  async assignToGroup(data: { studentId: string; groupId: string }) {
    await this.prisma.student.update({
      where: { id: data.studentId },
      data: {
        group: { connect: { id: data.groupId } },
      },
    });

    return { message: 'Student assigned to group successfully' };
  }
}
