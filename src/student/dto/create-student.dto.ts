import { IsDate, IsDateString, IsOptional, IsString } from 'class-validator';

export class CreateStudentDto {
  @IsString()
  password: string;

  @IsString()
  fullname: string;

  @IsString()
  level: string;

  @IsDate()
  @IsOptional()
  birthDate?: Date;

  @IsString()
  phone1: string;

  @IsString()
  @IsOptional()
  phone2: string;

  @IsString()
  courseId: string;
}
