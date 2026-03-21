import { IsNumber, IsString } from 'class-validator';

export class CourseDto {
  @IsString()
  name: string;

  @IsString()
  level: string;

  @IsString()
  schedule: string;

  @IsString()
  teacherId: string;

  @IsString()
  subjectId: string;

  @IsNumber()
  price: number;
}

export class EnrollStudentDto {
  @IsString()
  studentId: string;

  @IsString()
  courseId: string;
}
