import * as bcrypt from 'bcrypt';
import { Injectable, BadRequestException, HttpException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateStudentDto } from './dto/student.dto';

@Injectable()
export class StudentService {
  constructor(private prisma: PrismaService) { }

  generateReferralCode(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
      code += chars[Math.floor(Math.random() * chars.length)];
    }
    return code;
  }

  async create(dto: CreateStudentDto) {
    const user = await this.prisma.user.findFirst({
      where: { phone: dto.phone },
    })

    if (user)
      throw new BadRequestException('User with the same phone already exists');

    const hashedPassword = await bcrypt.hash(dto.firstname, 10);

    const newUser = await this.prisma.user.create(
      {
        data: {
          password: hashedPassword,
          phone: dto.phone,
          firstname: dto.firstname,
          lastname: dto.lastname,
          role: "STUDENT",
          birthDate: dto.birthDate
        }
      }
    )

    await this.prisma.student.create({
      data: {
        userId: newUser.id,
        referralCode: this.generateReferralCode(),
        groupId: dto.groupId || null
      }
    })

    return { message: "User created!" }
  }

  async getAllStudents() {
    const students = await this.prisma.student.findMany({
      include: { user: true, group: true, attendance: true, tests: true, payments: true },
    });

    return { data: students };
  }

  async assignStudentToGroup(data: { studentId: string; groupId: string }) {
    await this.prisma.student.update({
      where: { id: data.studentId },
      data: {
        group: { connect: { id: data.groupId } },
      },
    });

    return { message: 'Student assigned to group successfully' };
  }

  async deleteStudent(userId: string) {
    // const student = await this.prisma.student.findFirst({
    //   where: { userId: userId },
    // });

    // if (!student) {
    //   throw new BadRequestException('Student not found');
    // }

    // await this.prisma.student.delete({
    //   where: { userId: userId },
    // })

    await this.prisma.teacher.delete({
      where: { id: 'c5ddfa85-8b25-4d76-8eef-5506d5116262' },
    });

    return { message: 'Student deleted successfully' };
  }
}
