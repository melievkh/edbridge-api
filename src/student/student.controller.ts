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

  @Patch('/update/:id')
  updateStudent(@Param('id') studentId: string, @Body() dto: UpdateStudentDto) {
    return this.studentService.update(studentId, dto);
  }

  @Patch('add-to-course')
  addToCourse(@Body() { courseId, studentId }: { courseId: string; studentId: string }) {
    return this.studentService.addToCourse(studentId, courseId);
  }

  @Patch('remove-from-course')
  removeFromCourse(@Body() { courseId, studentId }: { courseId: string; studentId: string }) {
    return this.studentService.removeFromCourse(studentId, courseId);
  }

  @Delete(':id')
  deleteStudent(@Param('id') studentId: string) {
    return this.studentService.delete(studentId);
  }
}
