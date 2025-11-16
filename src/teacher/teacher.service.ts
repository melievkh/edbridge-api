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

  async getAllTeachers() {
    const teachers = await this.prisma.teacher.findMany({ include: { groups: true, user: true } })

    return { data: teachers }
  }

  async deleteTeacher(userId: string) {
    const teacher = await this.prisma.teacher.findUnique({
      where: { userId }
    });

    if (!teacher) {
      throw new BadRequestException('Teacher not found');
    }

    await this.prisma.teacher.delete({
      where: { userId },
    });

    await this.prisma.user.delete({
      where: { id: userId },
    });

    return { message: 'Teacher deleted successfully' };
  }
}
