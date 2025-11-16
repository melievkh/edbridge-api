import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { TeacherService } from './teacher.service';
import { TeacherDto } from './dto/create-teacher.dto';

@Controller('teacher')
export class TeacherController {
  constructor(private teacherService: TeacherService) { }

  @Post('create')
  create(@Body() dto: TeacherDto) {
    return this.teacherService.create(dto);
  }

  @Get()
  getAllTeachers() {
    return this.teacherService.getAllTeachers()
  }

  @Delete('delete/:id')
  deleteTeacher(@Param('id') userId: string) {
    return this.teacherService.deleteTeacher(userId);
  }
}
