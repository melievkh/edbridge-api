import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CourseService } from './course.service';
import { CourseDto, EnrollStudentDto } from './dto/create-course.dto';
import { AssignTeacherDto } from './dto/assign-teacher.dto';

@Controller('course')
export class CourseController {
  constructor(private courseService: CourseService) {}

  @Post()
  create(@Body() dto: CourseDto) {
    return this.courseService.create(dto);
  }

  @Get()
  getAll() {
    return this.courseService.getAll();
  }

  @Patch('assign-teacher')
  assignTeacherToCourse(@Body() dto: AssignTeacherDto) {
    return this.courseService.assignTeacherToCourse(dto);
  }

  @Patch('assign-subject')
  assignSubjectToCourse(@Body() subjectId: string, courseId: string) {
    return this.courseService.assignSubjectToCourse(subjectId, courseId);
  }

  @Post('/enroll-student')
  enrollStudentToCourse(@Body() dto: EnrollStudentDto) {
    return this.courseService.enrollStudentToCourse(dto);
  }

  // @Get(':id/students')
  // getCourseStudents(@Param('id') courseId: string) {
  //   return this.courseService.getCourseStudents(courseId)
  // }

  @Delete(':id')
  deleteCourse(@Param('id') courseId: string) {
    return this.courseService.delete(courseId);
  }
}
