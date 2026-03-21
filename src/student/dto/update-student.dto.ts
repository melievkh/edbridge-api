import { IsDate, IsOptional, IsString } from 'class-validator';

export class UpdateStudentDto {
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
}
