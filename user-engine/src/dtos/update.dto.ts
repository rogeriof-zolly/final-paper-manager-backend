import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsPhoneNumber, IsString, MaxLength, Validate } from "class-validator";
import { Roles } from "src/enums/roles.enum";

export class UpdateUserDto {
  
  @MaxLength(255)
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  name: string;

  @IsEmail()
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  @IsOptional()
  email: string;

  @IsPhoneNumber("BR")
  @IsNotEmpty()
  @IsString()
  @MaxLength(14)
  @IsOptional()
  phone: string

  @IsNotEmpty()
  @IsString()
  @IsOptional()
  cpfCnpj: string
}