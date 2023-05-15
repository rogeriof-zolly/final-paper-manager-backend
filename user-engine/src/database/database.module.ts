import { Module } from "@nestjs/common";
import { TypeOrmModule } from '@nestjs/typeorm'
import { UserEntity } from "src/entities/user.entity";

@Module({
  imports: [TypeOrmModule.forRoot({
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: '123456',
    database: 'users',
    entities: [UserEntity],
    synchronize: true
  })]
})
export class DatabaseModule {}