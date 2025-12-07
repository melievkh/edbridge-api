import { IsOptional, IsPhoneNumber, IsString } from 'class-validator';

export class UpdateStudentDto {
  @IsPhoneNumber()
  @IsOptional()
  phone: string;

  @IsString()
  @IsOptional()
  lastname: string

  @IsString()
  @IsOptional()
  firstname: string

  @IsString()
  @IsOptional()
  status: StudentStatus;

  @IsOptional()
  birthDate?: string;

  @IsString()
  @IsOptional()
  groupId?: string;
}

enum StudentStatus {
  NEW,
  ACTIVE,
  SUSPENDED,
  GRADUATED
}
