import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { TeacherService } from './teacher.service';
import { CreateTeacherDto } from './dto/create-teacher.dto';
import { UpdateTeacherDto } from './dto/update-teacher.dto';

@Controller('teacher')
export class TeacherController {
  constructor(private teacherService: TeacherService) { }

  @Post()
  create(@Body() dto: CreateTeacherDto) {
    return this.teacherService.create(dto);
  }

  @Get()
  getAllTeachers() {
    return this.teacherService.getAll()
  }

  @Patch(':id')
  update(@Param('id') teacherId: string, @Body() dto: UpdateTeacherDto) {
    return this.teacherService.update(teacherId, dto);
  }

  @Delete(':id')
  delete(@Param('id') teacherId: string) {
    return this.teacherService.delete(teacherId);
  }
}
