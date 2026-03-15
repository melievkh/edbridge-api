import * as bcrypt from 'bcrypt';
import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTeacherDto, } from './dto/create-teacher.dto';
import { generateUniqueLogin } from 'src/utils/generate-login.util';
import { UpdateTeacherDto } from './dto/update-teacher.dto';


@Injectable()
export class TeacherService {
  constructor(private prisma: PrismaService) { }

  // CREATE A TEACHER

  async create(dto: CreateTeacherDto) {
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
          role: 'TEACHER',
          birthDate: dto.birthDate,
          phone1: dto.phone1,
          phone2: dto.phone2,
        },
      });

      const teacher = await tx.teacher.create({
        data: {
          userId: newUser.id,
          status: dto.status || 'MAIN',
        },
      });

      return { newUser, teacher };
    });

    return { data: result.newUser.login };
  }

  // GET ALL TEACHERS

  async getAll() {
    const teachers = await this.prisma.teacher.findMany({ include: { groups: true, user: true, subjects: true } })

    return { data: teachers };
  }

  // UPDATE A TEACHER

  async update(teacherId: string, dto: UpdateTeacherDto) {
    const teacher = await this.prisma.teacher.findUnique({
      where: { id: teacherId },
    });

    if (!teacher) {
      throw new BadRequestException('Teacher not found');
    }

    const updatedUser = await this.prisma.user.update({
      where: { id: teacher.userId },
      data: {
        ...(dto.phone1 !== undefined && { phone1: dto.phone1 }),
        ...(dto.phone2 !== undefined && { phone2: dto.phone2 }),
        ...(dto.fullname !== undefined && { fullname: dto.fullname }),
        ...(dto.birthDate !== undefined && { birthDate: dto.birthDate }),
      },
    });

    return { data: updatedUser };
  }


  // DELETE A TEACHER

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
