import { Body, Controller, Get, Param, Post, UseFilters, HttpException } from '@nestjs/common';
import { AppService } from './app.service';
import { UserDto } from './dtos/user.dto';

@Controller('users')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  allUsers(){
    return this.appService.getAllUsers();
  }

  @Get(':id')
  getUserById(@Param('id') id: string){
    return this.appService.getUserById(id);
  }

  @Post()
  create(@Body() user: UserDto){
    return this.appService.create(user);
  }
}
