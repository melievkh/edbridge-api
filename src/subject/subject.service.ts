import { HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { SubjectDto } from './dto/subject.dto';

@Injectable()
export class SubjectService {
  constructor(private prisma: PrismaService) { }

  async create(dto: SubjectDto) {
    await this.prisma.subject.create({
      data: { name: dto.name }
    })

    return { message: "Subject created successfully!" }
  }

  async getAll() {
    const subjects = await this.prisma.subject.findMany()

    return { data: subjects }
  }
}
