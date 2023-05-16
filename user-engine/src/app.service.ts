import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { CreateUserDto } from './dtos/create.dto';
import { Repository } from 'typeorm';
import { UpdateUserDto } from './dtos/update.dto';

@Injectable()
export class AppService {

  constructor(@InjectRepository(UserEntity) private usersRepository:Repository<UserEntity>){}

  async getAllUsers(): Promise<UserEntity[]> {
    return this.usersRepository.find();
  }

  async getUserById(userId:string): Promise<UserEntity>{
    const foundUser = await this.usersRepository.find(
      {
        where:{ id: userId }, 
        withDeleted: true
      }
    );

    if(foundUser.length < 1)
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);

    return foundUser[0];
  }

  async create(user: CreateUserDto): Promise<UserEntity> {
    return this.usersRepository.save(user);
  }

  async update(userId: string, updatedUserData: UpdateUserDto): Promise<UserEntity> {
    const foundUser = await this.getUserById(userId);

    if(foundUser.deletedAt !== null)
      throw new HttpException('Cannot update a deleted user', HttpStatus.BAD_REQUEST);

    foundUser.name = updatedUserData.name ? updatedUserData.name : foundUser.name;
    foundUser.email = updatedUserData.email ? updatedUserData.email : foundUser.email;
    foundUser.cpfCnpj = updatedUserData.cpfCnpj ? updatedUserData.cpfCnpj : foundUser.cpfCnpj;
    foundUser.phone = updatedUserData.phone ? updatedUserData.phone : foundUser.phone;

    return this.usersRepository.save(foundUser);
  }

  async delete(userId: string): Promise<void> {
    const foundUser = await this.getUserById(userId);
    await this.usersRepository.softDelete({ id: foundUser.id });
  }
}
