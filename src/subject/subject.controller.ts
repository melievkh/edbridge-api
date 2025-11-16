import { Body, Controller, Get, Post } from '@nestjs/common';
import { SubjectService } from './subject.service';
import { SubjectDto } from './dto/subject.dto';

@Controller('subject')
export class SubjectController {
  constructor(private subjectService: SubjectService) { }

  @Post('create')
  create(@Body() dto: SubjectDto) {
    return this.subjectService.create(dto);
  }

  @Get()
  getAll() {
    return this.subjectService.getAll();
  }
}
