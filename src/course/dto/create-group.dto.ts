import { IsString } from 'class-validator';

export class GroupDto {
  @IsString()
  name: string;

  @IsString()
  level: string;

  @IsString()
  schedule: string;

  @IsString()
  teacherId: string;

  @IsString()
  subjectId: string;
}
