import { IsPhoneNumber, IsString } from 'class-validator';

export class LoginDto {
  @IsPhoneNumber()
  login: string;

  @IsString()
  password: string;
}