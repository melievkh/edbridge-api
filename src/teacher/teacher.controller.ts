import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { TeacherService } from './teacher.service';
import { CreateTeacherDto } from './dto/create-teacher.dto';

@Controller('teacher')
export class TeacherController {
  constructor(private teacherService: TeacherService) { }

  @Post('create')
  create(@Body() dto: CreateTeacherDto) {
    return this.teacherService.create(dto);
  }

  @Get()
  getAllTeachers() {
    return this.teacherService.getAll()
  }

  @Delete('delete/:id')
  deleteTeacher(@Param('id') userId: string) {
    return this.teacherService.delete(userId);
  }
}
