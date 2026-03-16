import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { StudentService } from './student.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';

@Controller('student')
export class StudentController {
  constructor(private studentService: StudentService) { }

  @Post()
  create(@Body() dto: CreateStudentDto) {
    return this.studentService.create(dto);
  }

  @Get()
  getAll() {
    return this.studentService.getAll();
  }

  @Patch(':id')
  updateStudent(@Param('id') studentId: string, @Body() dto: UpdateStudentDto) {
    return this.studentService.update(studentId, dto);
  }

  @Delete(':id')
  deleteStudent(@Param('id') studentId: string) {
    return this.studentService.delete(studentId);
  }

  @Post('add-to-course')
  assignStudentToCourse(@Body() data: { studentId: string, courseId: string }) {
    return this.studentService.assignToCourse(data)
  }
}
