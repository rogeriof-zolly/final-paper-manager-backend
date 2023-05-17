import { Test, TestingModule } from "@nestjs/testing";
import { AppService } from "./app.service"
import { UserEntity } from "./entities/user.entity";
import { getRepositoryToken } from "@nestjs/typeorm";
import { CreateUserDto } from "./dtos/create.dto";
import { Roles } from "./enums/roles.enum";
import { v4 } from 'uuid';
import { HttpException, NotFoundException } from "@nestjs/common";
import { FindOneOptions } from "typeorm";
import { UpdateUserDto } from "./dtos/update.dto";
import { Status } from "./enums/status.enum";

describe('UserService', () => {
  let service: AppService;

  class UserRepo {
    data = [];

    save(user: any) {
      const userToBeAdded: UserEntity = {
          id: v4(),
          ...user,
          createdAt: new Date(Date.now()),
          updatedAt: new Date(Date.now()),
          deletedAt: null,
          status: Status.ACTIVE
      }
      this.data.push(
        userToBeAdded
      );
      return userToBeAdded;
    }

    findOne(options: any) {
      const user = this.data.find(element => {return element.id === options.where['id']});
      return user
    }

    find() {
      return this.data;
    }

    softDelete(criteria: UserEntity): void {
      const foundUser = this.data.find(element => {return element.id === criteria.id});
      foundUser.deletedAt = new Date(Date.now());
      this.save(foundUser)
    }
  }

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AppService,
        {
          provide: getRepositoryToken(UserEntity),
          useClass: UserRepo
        },
      ],
    }).compile();

    service = module.get<AppService>(AppService);
  })

  it('create() - it should create a new STUDENT user successfully', async () => {
    const createUserPayload: CreateUserDto = {
      name: 'Rogério Zolly Student Test',
      cpfCnpj: '94390430439403',
      email: 'rogeriostudent@teste.com',
      phone: '+5554999959889',
      role: Roles.STUDENT
    }

    const newTestUser = await service.create(createUserPayload);

    expect(newTestUser).toBeDefined();
    expect(newTestUser).toHaveProperty('id');
  });

  it('create() - it should create a new PROFESSOR user successfully', async () => {
    const createUserPayload: CreateUserDto = {
      name: 'Rogério Zolly Professor Test',
      cpfCnpj: '94390430439403',
      email: 'rogeriosprofessor@teste.com',
      phone: '+5554999959889',
      role: Roles.PROFESSOR
    }

    const newTestUser = await service.create(createUserPayload);

    // should not return null
    expect(newTestUser).toBeDefined();
    // should have an ID property
    expect(newTestUser).toHaveProperty('id');
    // all the common properties between given and added user should be equal
    expect(newTestUser).toEqual(
      expect.objectContaining(createUserPayload)
    );
  });

  it('update() - it should update an existing user', async () => {
    const originalUser: CreateUserDto = {
      name: 'Rogério Zolly Teste de Atualização',
      cpfCnpj: '94390430439403',
      email: 'rogeriozolly@teste.com',
      phone: '+5554999959889',
      role: Roles.STUDENT
    }
    const createdUser = await service.create(originalUser);

    const newUserData: UpdateUserDto = {
      name: 'Rogério Zolly Usuário atualizado',
      cpfCnpj: '438434938934',
      email: 'rogeriozolly@testeatualizado.com',
      phone: '+5554999940909'
    }

    const updatedUser = await service.update(createdUser.id, newUserData);

    // all the common properties between original and updated user should be different
    expect(updatedUser).toEqual(
      expect.not.objectContaining(createdUser)
    ); 
    // all the common properties between given and updated user should be equal
    expect(updatedUser).toEqual(
      expect.objectContaining(newUserData)
    );
    expect(updatedUser.id).toEqual(createdUser.id);
  })

  it('update() - it should not update a non existing user', async () => {
    try {
      await service.update('c32d8b45-92fe-44f6-8b61-42c2107dfe87', {
        name: 'Rogério Zolly Teste',
        cpfCnpj: '94390430439403',
        email: 'rogeriozolly@teste.com',
        phone: '+5554999959889',
      });
    }catch(error) {
      expect(error).toBeInstanceOf(HttpException);
      expect(error.response).toEqual('User not found');
    }
  });

  it('update() - it should not update a deleted user', async() => {
    try {
      const createUserPayload: CreateUserDto = {
        name: 'Usuário que vai ser deletado',
        cpfCnpj: '94390430439403',
        email: 'rogeriozolly@teste.com',
        phone: '+5554999959889',
        role: Roles.STUDENT
      }
  
      const userToBeDeleted = await service.create(createUserPayload);
  
      await service.delete(userToBeDeleted.id);

      await service.update(userToBeDeleted.id, {
        name: 'unused data',
        cpfCnpj: 'unused data',
        email: 'unused data',
        phone: 'unused data'
      })
    } catch (error) {
      expect(error).toBeInstanceOf(HttpException);
      expect(error.response).toEqual('Cannot update a deleted user');
    }
  });

  it('getUser() - it should return a user', async () => {
    const users = await service.getAllUsers();

    console.log(await service.getUserById(users[0].id));
  })

  it('getUsers() - it should return all users', async () => {
    expect(
      await service.getAllUsers()
    ).toBeInstanceOf(Array);
  })

  it('delete() - it should delete a user', async () => {
    const createUserPayload: CreateUserDto = {
      name: 'Usuário que vai ser deletado',
      cpfCnpj: '94390430439403',
      email: 'rogeriozolly@teste.com',
      phone: '+5554999959889',
      role: Roles.STUDENT
    }

    const userToBeDeleted = await service.create(createUserPayload);

    await service.delete(userToBeDeleted.id);

    expect((await service.getUserById(userToBeDeleted.id)).deletedAt).not.toBeNull();
    expect((await service.getUserById(userToBeDeleted.id)).deletedAt).toBeInstanceOf(Date);
  })
})