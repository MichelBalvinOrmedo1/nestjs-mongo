import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  nombres: string;

  @IsString()
  @IsOptional()
  apellidoPaterno: string = '';

  @IsString()
  @IsOptional()
  apellidoMaterno: string = '';

  @IsString()
  @IsOptional()
  telefono: string = '';

  @IsNotEmpty()
  @IsEmail()
  email: string;
}
