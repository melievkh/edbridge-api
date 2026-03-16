import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CourseDto } from './dto/create-course.dto';
import { AssignTeacherDto } from './dto/assign-teacher.dto';

@Injectable()
export class CourseService {
  constructor(private prisma: PrismaService) { }

  async create(dto: CourseDto) {
    await this.prisma.course.create({
      data: {
        name: dto.name,
        level: dto.level,
        schedule: dto.schedule,
        teacherId: dto.teacherId,
        subjectId: dto.subjectId,
        price: dto.price
      },
      include: { teacher: true, subject: true, students: true }
    })

    return { message: "Course created successfully!" }
  }

  async assignTeacherToCourse(dto: AssignTeacherDto) {
    await this.prisma.course.update({
      where: { id: dto.courseId },
      data: { teacherId: dto.teacherId },
      include: { teacher: true }
    })

    return { message: "Teacher assigned to course successfully!" }
  }

  async assignSubjectToCourse(subjectId: string, courseId: string) {
    await this.prisma.course.update({
      where: { id: courseId },
      data: { subjectId }
    })
  }

  async update(courseId: string, dto: CourseDto) {
    await this.prisma.course.update({
      where: { id: courseId },
      data: {
        name: dto.name,
        level: dto.level,
        schedule: dto.schedule,
        teacherId: dto.teacherId,
        subjectId: dto.subjectId
      }
    })

    return { message: "Course updated successfully!" }
  }

  async getAll() {
    const courses = await this.prisma.course.findMany({
      include: {
        teacher: true,
        subject: true,
        students: true
      }
    })

    return { data: courses }
  }

  async delete(courseId: string) {
    await this.prisma.course.delete({
      where: { id: courseId }
    })

    return { message: "Course deleted successfully!" }
  }
}
