import {
  IsDate,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

enum PaymentMethod {
  CASH = 'CASH',
  CARD = 'CARD',
  ONLINE = 'ONLINE',
}

export class CreatePaymentDto {
  @IsString()
  studentId: string;

  @IsString()
  @IsOptional()
  referalStudentId?: string;

  @IsString()
  courseId: string;

  @IsNumber()
  amount: number;

  @IsEnum(PaymentMethod)
  method: PaymentMethod;

  @IsNumber()
  month: number;

  @IsNumber()
  year: number;
}
