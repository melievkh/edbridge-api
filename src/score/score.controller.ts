import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ScoreService } from './score.service';

@Controller('score')
export class ScoreController {
  constructor(private scoreService: ScoreService) { }

  @Post()
  create(@Body() dto: { courseId: string; date: string; students: { studentId: string; score?: number }[] }) {
    return this.scoreService.submitScores(dto.courseId, new Date(dto.date), dto.students);
  }

  @Get(':id')
  getCourseScores(@Param('id') courseId: string) {
    return this.scoreService.getCourseScores(courseId);
  }

  @Post('/delete')
  deleteCourseScores() {
    return this.scoreService.deleteScores()
  }
}