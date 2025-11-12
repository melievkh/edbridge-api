import { IsDate, IsPhoneNumber, IsString } from 'class-validator';

export class StudentDto {
  @IsPhoneNumber()
  phone: string;

  @IsString()
  lastname: string

  @IsString()
  firstname: string

  @IsString()
  password: string;

  @IsDate()
  birthDate?: Date;

  @IsString()
  groupId?: string;
}

