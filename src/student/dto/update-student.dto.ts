import { IsDateString, IsOptional, IsString } from 'class-validator';

export class UpdateStudentDto {
  @IsString()
  fullname: string

  @IsOptional()
  @IsDateString()
  birthDate?: string;

  @IsString()
  phone1: string;

  @IsString()
  @IsOptional()
  phone2: string;

  @IsOptional()
  status?: StudentStatus;
}

enum StudentStatus {
  NEW,
  ACTIVE,
  SUSPENDED,
  GRADUATED
}
