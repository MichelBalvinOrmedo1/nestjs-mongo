import { Controller, Get, UseGuards, Req, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import type { Request } from 'express';

import { JwtAuthGuard } from './guards/jwt.guard';

import { LoginDTO } from './dto/login.dto';
import { JwtOptionalAuthGuard } from './guards/JwtOptionalAuth.guard';
import { RequestWithUser } from './interfaces/request-with-user.interface';
import { CreateUserPrincipalDto } from '../users/dto/createUserPrincipal';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('user')
  @UseGuards(JwtAuthGuard)
  async user(@Req() req: Request) {
    const { user } = req;
    user['password'] = undefined;
    return {
      status: 'success',
      message: 'User details',
      data: user,
    };
  }

  @Post('register')
  @UseGuards(JwtOptionalAuthGuard) // Aplica la guarda opcional aquí
  async register(
    @Body() createUserDto: CreateUserPrincipalDto,
    @Req() req: RequestWithUser, // Inyecta el request con el usuario opcional
  ) {
    const authenticatedUser = req.user || null; // Puede ser null si no se proporciona token
    const tipoUsuario = authenticatedUser?.tipoUsuario || ''; // Si no hay usuario autenticado, se asume que es un

    return this.authService.createUser(createUserDto, tipoUsuario);
  }
  @Post('login')
  async login(@Body() loginDTO: LoginDTO) {
    return this.authService.loginUser(loginDTO);
  }
}
