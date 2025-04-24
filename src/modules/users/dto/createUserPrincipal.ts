import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateUserPrincipalDto {
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

  @IsOptional()
  @IsString()
  password: string;

  @IsOptional()
  @IsString()
  tipoUsuario: string;
}
