import { BadRequestException, HttpException, Injectable } from '@nestjs/common';
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
    const subjects = await this.prisma.subject.findMany({
      include: { groups: true, teachers: true }
    })

    return { data: subjects }
  }

  async update(subjectId: string, dto: SubjectDto) {
    const subject = await this.prisma.subject.findUnique({
      where: { id: subjectId }
    })

    if (!subject) {
      throw new BadRequestException("Subject not found")
    }

    await this.prisma.subject.update({
      where: { id: subjectId },
      data: { name: dto.name }
    })

    return { message: "Subject updated successfully!" }
  }

  async delete(subjectId: string) {
    const subject = await this.prisma.subject.findUnique({
      where: { id: subjectId }
    })

    if (!subject) {
      throw new HttpException("Subject not found", 404)
    }

    await this.prisma.subject.delete({
      where: { id: subjectId }
    })

    return { message: "Subject deleted successfully!" }
  }
}
