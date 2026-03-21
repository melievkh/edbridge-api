import { Controller, Delete, Get, Param, Request } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  getAll() {
    return this.userService.getAll();
  }

  @Get('/me')
  getMe(@Request() req) {
    return this.userService.findById(req.user.userId);
  }

  @Delete(':id')
  deleteUser(@Param('id') userId: string) {
    return this.userService.delete(userId);
  }
}
