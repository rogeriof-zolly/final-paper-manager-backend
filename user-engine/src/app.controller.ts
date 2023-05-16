import { Body, Controller, Get, Param, Post, UseFilters, HttpException, Put, Delete } from '@nestjs/common';
import { AppService } from './app.service';
import { CreateUserDto } from './dtos/create.dto';
import { UpdateUserDto } from './dtos/update.dto';

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
  create(@Body() user: CreateUserDto){
    return this.appService.create(user);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updatedUserData: UpdateUserDto){
    return this.appService.update(id, updatedUserData);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.appService.delete(id);
  }
}
