import { IsEmail, IsEnum, IsNotEmpty, IsPhoneNumber, IsString, MaxLength, Validate } from "class-validator";
import { Roles } from "src/enums/roles.enum";

export class UserDto {
  
  @MaxLength(255)
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEnum(Roles)
  @IsString()
  @IsNotEmpty()
  role: Roles

  @IsEmail()
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  email: string;

  @IsPhoneNumber("BR")
  @IsNotEmpty()
  @IsString()
  @MaxLength(14)
  phone: string

  @IsNotEmpty()
  @IsString()
  cpfCnpj: string
}