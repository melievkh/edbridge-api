import { HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { GroupDto } from './dto/create-group.dto';
import { AssignTeacherDto } from './dto/assign-teacher.dto';

@Injectable()
export class GroupService {
  constructor(private prisma: PrismaService) { }

  async create(dto: GroupDto) {
    await this.prisma.group.create({
      data: {
        name: dto.name,
        level: dto.level,
        schedule: dto.schedule,
        teacherId: dto.teacherId,
        subjectId: dto.subjectId
      },
      include: { teacher: true, subject: true }
    })

    return { message: "Group created successfully!" }
  }

  async assignTeacherToGroup(dto: AssignTeacherDto) {
    await this.prisma.group.update({
      where: { id: dto.groupId },
      data: { teacherId: dto.teacherId },
      include: { teacher: true }
    })

    return { message: "Teacher assigned to group successfully!" }
  }

  async assignSubjectToGroup(subjectId: string, groupId: string) {
    await this.prisma.group.update({
      where: { id: groupId },
      data: { subjectId }
    })
  }

  async updateGroup(groupId: string, dto: GroupDto) {
    await this.prisma.group.update({
      where: { id: groupId },
      data: {
        name: dto.name,
        level: dto.level,
        schedule: dto.schedule,
        teacherId: dto.teacherId,
        subjectId: dto.subjectId
      }
    })

    return { message: "Group updated successfully!" }
  }

  async getGroupStudents(groupId: string) {
    const students = await this.prisma.student.findMany({
      where: { groupId },
      include: { group: true }
    })

    return { data: students }
  }

  async getAllGroups() {
    const groups = await this.prisma.group.findMany({
      include: {
        teacher: true,
        subject: true,
        students: true
      }
    })

    return { data: groups }
  }

  async deleteGroup(groupId: string) {
    await this.prisma.group.delete({
      where: { id: groupId }
    })

    return { message: "Group deleted successfully!" }
  }
}
