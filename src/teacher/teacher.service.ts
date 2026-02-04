import * as bcrypt from 'bcrypt';
import { BadRequestException, HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { TeacherDto } from './dto/create-teacher.dto';


@Injectable()
export class TeacherService {
  constructor(private prisma: PrismaService) { }

  async create(dto: TeacherDto) {
    const user = await this.prisma.user.findFirst({
      where: { phone: dto.phone, lastname: dto.lastname },
    })

    if (user)
      throw new BadRequestException('User with the same phone already exists');

    const hashedPassword = await bcrypt.hash(dto.firstname, 10);

    const newteacher = await this.prisma.user.create(
      {
        data: {
          password: hashedPassword,
          phone: dto.phone,
          firstname: dto.firstname,
          lastname: dto.lastname,
          role: "TEACHER",
          birthDate: dto.birthDate
        }
      }
    )

    await this.prisma.teacher.create({
      data: {
        userId: newteacher.id
      }
    })

    return { message: "Teacher created!" }
  }

  async getAll() {
    const teachers = await this.prisma.teacher.findMany({ include: { groups: true, user: true, subjects: true } })

    return teachers
  }

  async delete(teacherId: string) {
    const teacher = await this.prisma.teacher.findFirst({
      where: { id: teacherId },
    });

    if (!teacher) {
      throw new BadRequestException('Teacher not found');
    }
    await this.prisma.teacher.delete({
      where: { id: teacherId },
    })

    await this.prisma.user.delete({
      where: { id: teacher.userId },
    });

    return { message: 'Teacher deleted successfully' };
  }
}
