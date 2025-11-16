import { Type } from 'class-transformer';
import { IsDate, IsOptional, IsPhoneNumber, IsString } from 'class-validator';

export class TeacherDto {
  @IsPhoneNumber()
  phone: string;

  @IsString()
  lastname: string

  @IsString()
  firstname: string

  @IsString()
  @IsOptional()
  password?: string;

  @IsString()
  @IsOptional()
  birthDate?: string;
}

