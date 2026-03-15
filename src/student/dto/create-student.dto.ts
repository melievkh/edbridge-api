import { IsDateString, IsOptional, IsString } from 'class-validator';

export class CreateStudentDto {
  @IsString()
  password: string;

  @IsString()
  fullname: string

  @IsDateString()
  @IsOptional()
  birthDate?: string;

  @IsString()
  phone1: string;

  @IsString()
  @IsOptional()
  phone2: string;

  @IsString()
  groupId?: string;
}

