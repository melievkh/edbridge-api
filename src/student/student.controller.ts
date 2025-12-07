import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { StudentService } from './student.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';

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

  @Patch(':id')
  updateStudent(@Param('id') studentId: string, @Body() dto: UpdateStudentDto) {
    return this.studentService.updateStudent(studentId, dto);
  }

  @Delete('delete/:id')
  deleteStudent(@Param('id') studentId: string) {
    return this.studentService.deleteStudent(studentId);
  }

  @Post('add-to-group')
  assignStudentToGroup(@Body() data: { studentId: string, groupId: string }) {
    return this.studentService.assignStudentToGroup(data)
  }
}
