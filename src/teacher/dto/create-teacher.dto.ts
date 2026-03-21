import { IsDate, IsDateString, IsOptional, IsString } from 'class-validator';

export class CreateTeacherDto {
  @IsString()
  password: string;

  @IsString()
  fullname: string;

  @IsDate()
  @IsOptional()
  birthDate?: Date;

  @IsString()
  phone1: string;

  @IsString()
  @IsOptional()
  phone2: string;

  status?: TeacherStatus;
}

enum TeacherStatus {
  MAIN = 'MAIN',
  ASSISTANT = 'ASSISTANT',
}
