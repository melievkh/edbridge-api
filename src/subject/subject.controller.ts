import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { SubjectService } from './subject.service';
import { SubjectDto } from './dto/subject.dto';

@Controller('subject')
export class SubjectController {
  constructor(private subjectService: SubjectService) { }

  @Post()
  create(@Body() dto: SubjectDto) {
    return this.subjectService.create(dto);
  }

  @Get()
  getAll() {
    return this.subjectService.getAll();
  }

  @Patch(':id')
  update(@Param('id') subjectId: string, @Body() dto: SubjectDto) {
    return this.subjectService.update(subjectId, dto);
  }

  @Delete(':id')
  delete(@Param('id') subjectId: string) {
    return this.subjectService.delete(subjectId);
  }
}