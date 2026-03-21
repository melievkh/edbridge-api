import { IsDate, IsOptional, IsString } from 'class-validator';

export class UpdateTeacherDto {
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
