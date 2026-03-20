import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) { }

  async getAll() {
    const users = await this.prisma.user.findMany({ include: { student: true, teacher: true } });
    return { data: users };
  }

  async findById(userId) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId }, include: { student: { include: { scores: true, courses: true, payments: true } }, teacher: true }
    })

    if (!user) {
      throw new BadRequestException('User not found');
    }

    return user
  }

  async delete(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    await this.prisma.user.delete({
      where: { id: userId },
    });

    return { message: 'User deleted successfully' };
  }
}
