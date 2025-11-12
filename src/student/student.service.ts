import { Injectable, BadRequestException, HttpException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { StudentDto } from './dto/student.dto';

@Injectable()
export class StudentService {
  constructor(private prisma: PrismaService) { }

  async create(dto: StudentDto) {
    try {
      const user = await this.prisma.user.findFirst({
        where: { phone: dto.phone, lastname: dto.lastname },
      })
      console.log(user);
      if (user)
        throw new BadRequestException('User with the same phone already exists');

      const hashedPassword = await bcrypt.hash(dto.firstname, 10);
      await this.prisma.student.create({
        data: {
          user: {
            create: {
              firstname: dto.firstname,
              lastname: dto.lastname,
              phone: dto.phone,
              password: hashedPassword,
              role: 'STUDENT',
              birthDate: dto.birthDate,
            },
          },
          group: dto.groupId
            ? { connect: { id: dto.groupId } }
            : undefined,
        },
        include: {
          user: true,
          group: true,
        },
      });

      return { message: "User created!" }
    } catch (error) {
      if (error instanceof BadRequestException) throw error;
      throw new HttpException('Failed to create student', 500);
    }
  }
}
