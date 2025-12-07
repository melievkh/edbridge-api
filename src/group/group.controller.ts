import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { GroupService } from './group.service';
import { GroupDto } from './dto/create-group.dto';
import { AssignTeacherDto } from './dto/assign-teacher.dto';

@Controller('group')
export class GroupController {
  constructor(private groupService: GroupService) { }

  @Post('create')
  create(@Body() dto: GroupDto) {
    return this.groupService.create(dto);
  }

  @Get()
  getAll() {
    return this.groupService.getAllGroups()
  }

  @Patch('assign-teacher')
  assignTeacherToGroup(@Body() dto: AssignTeacherDto) {
    return this.groupService.assignTeacherToGroup(dto);
  }

  @Patch('assign-subject')
  assignSubjectToGroup(@Body() subjectId: string, groupId: string) {
    return this.groupService.assignSubjectToGroup(subjectId, groupId);
  }

  @Get(':id/students')
  getGroupStudents(@Param('id') groupId: string) {
    return this.groupService.getGroupStudents(groupId)
  }

  @Delete('delete/:id')
  deleteGroup(@Param('id') groupId: string) {
    return this.groupService.deleteGroup(groupId);
  }
}
