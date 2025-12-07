import { Controller, Delete, Get, Param, } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) { }

  @Get()
  getAll() {
    return this.userService.getAllUsers();
  }

  @Delete('delete/:id')
  deleteUser(@Param('id') userId: string) {
    return this.userService.deleteUser(userId);
  }
}
