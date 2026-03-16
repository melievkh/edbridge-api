import { IsString, IsNumber, IsOptional } from 'class-validator';

export class CreateScoreDto {
  @IsString()
  studentId: string;

  @IsNumber()
  @IsOptional()
  score?: number
}
