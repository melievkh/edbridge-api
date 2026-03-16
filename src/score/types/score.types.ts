import { CreateScoreDto } from '../dto/create-score.dto';

export type SubmitScoresRequest = {
  courseId: string;
  date: string;
  students: CreateScoreDto[];
};