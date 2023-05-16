import { Test, TestingModule } from "@nestjs/testing";
import { AppService } from "./app.service"
import { UserEntity } from "./entities/user.entity";
import { getRepositoryToken } from "@nestjs/typeorm";
import { CreateUserDto } from "./dtos/create.dto";
import { Roles } from "./enums/roles.enum";

describe('UserService', () => {
  let service: AppService;

  class UserRepo {
    save(user:UserEntity) {
      return user;
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

  it('create() - it should create a new user successfully', async () => {
    const createUserPayload: CreateUserDto = {
      name: 'Rogério Zolly Teste',
      cpfCnpj: '94390430439403',
      email: 'rogeriozolly@teste.com',
      phone: '+5554999959889',
      role: Roles.STUDENT
    }

    const newTestUser = await service.create(createUserPayload);

    expect(newTestUser).toBeDefined();
  })
})