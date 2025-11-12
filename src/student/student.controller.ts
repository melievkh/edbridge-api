import { Body, Controller, Post } from '@nestjs/common';
import { StudentService } from './student.service';

@Controller('student')
export class StudentController {
  constructor(private studentService: StudentService) { }

  @Post('create')
  create(@Body() dto) {
    return this.studentService.create(dto);
  }
}
