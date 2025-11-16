import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { StudentService } from './student.service';
import { CreateStudentDto } from './dto/student.dto';

@Controller('student')
export class StudentController {
  constructor(private studentService: StudentService) { }

  @Post('create')
  create(@Body() dto: CreateStudentDto) {
    return this.studentService.create(dto);
  }

  @Get()
  getAll() {
    return this.studentService.getAllStudents();
  }

  @Post('assign-group')
  assignStudentToGroup(@Body() data: { studentId: string, groupId: string }) {
    return this.studentService.assignStudentToGroup(data)
  }

  @Delete('delete/:id')
  deleteStudent(@Param('id') userId: string) {
    return this.studentService.deleteStudent(userId);
  }
}
