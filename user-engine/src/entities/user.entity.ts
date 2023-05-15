import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { Status } from "../enums/status.enum";

@Entity()
export class UserEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @Column()
  name: string

  @Column()
  role: string

  @Column()
  email: string

  @Column()
  phone: string

  @Column({ default: 'ACTIVE' })
  status: Status

  @Column()
  cpfCnpj: string
}
