import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { UserDto } from './dtos/user.dto';
import { Repository } from 'typeorm';

@Injectable()
export class AppService {

  constructor(@InjectRepository(UserEntity) private usersRepository:Repository<UserEntity>){}

  async getAllUsers(): Promise<UserEntity[]> {
    return this.usersRepository.find();
  }

  async getUserById(userId:string): Promise<UserEntity>{
    return this.usersRepository.findOne({
      where: { id: userId }
    });
  }

  async create(user: UserDto): Promise<UserEntity> {
    return this.usersRepository.save(user);
  }

  getHello(): string {
    return 'Hello World!';
  }
}
