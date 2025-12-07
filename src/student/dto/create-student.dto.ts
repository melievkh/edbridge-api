import { IsDate, IsOptional, IsPhoneNumber, IsString } from 'class-validator';

export class CreateStudentDto {
  @IsPhoneNumber()
  phone: string;

  @IsString()
  lastname: string

  @IsString()
  firstname: string

  @IsOptional()
  birthDate?: string;

  @IsString()
  groupId?: string;
}

