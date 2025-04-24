import {
  BadGatewayException,
  BadRequestException,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../users/schemas/user.schema';
import { Model } from 'mongoose';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { JwtService } from '@nestjs/jwt';
import { AuthPayloadDTO } from './dto/auth.dto';
import * as crypto from 'crypto';
import { UsersService } from '../users/users.service';
import { LoginDTO } from './dto/login.dto';
import { JwtOptionalAuthGuard } from './guards/JwtOptionalAuth.guard';
import { CreateUserPrincipalDto } from '../users/dto/createUserPrincipal';

export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}
  // auth.service.ts
  async validJwtAuthUser(payload: {
    userId: string;
    email: string;
    tipoUsuario: string;
  }): Promise<User | null> {
    return this.usersService.findOneById(payload.userId);
  }
  async getToken(payload: AuthPayloadDTO) {
    const user = await this.userModel.findOne({
      email: payload.email,
    });
    if (!user) return null;
    const { email, _id } = user;
    return this.jwtService.sign({ email, userId: _id });
  }
  async getUserById(userId) {
    return this.userModel.findById(userId);
  }
  async validUser(payload: AuthPayloadDTO) {
    const user = await this.userModel.findOne({ ...payload, status: 'ACTIVE' });
    if (!user) return null;
    return user;
  }

  async validateUser(userDetails: CreateUserDto) {
    const user = await this.userModel.findOne({
      email: userDetails.email,
    });

    if (user) return user;

    const newUser = await this.userModel.create(userDetails);

    return newUser;
  }

  async findUser(email: string): Promise<User> {
    const user = await this.userModel.findOne({
      email: email,
    });

    return user;
  }
  @UseGuards(JwtOptionalAuthGuard)
  async createUser(createUserDto: CreateUserPrincipalDto, tipoUsuario: string) {
    const user = await this.userModel.findOne({ email: createUserDto.email });
    if (user) {
      throw new BadRequestException({
        status: 'error',
        message: 'El correo ya está registrado',
      });
    }

    if (tipoUsuario !== 'ADMINISTRADOR') {
      createUserDto.tipoUsuario = 'CLIENTE';
    }
    const passwordb = crypto
      .createHash('sha512')
      .update(createUserDto.password)
      .digest('hex');

    createUserDto.password = passwordb;
    const newUser = new this.userModel({ ...createUserDto });
    await newUser.save();

    // const payload = {
    //   userId: newUser._id,
    //   email: newUser.email,
    // };
    // const token = this.jwtService.sign(payload);
    //sin el password

    const { password, ...userNew } = newUser.toObject();

    return {
      status: 'success',
      message: 'Usuario creado exitosamente',
      data: userNew,
    };
  }

  async validateEmail(email: string): Promise<boolean> {
    const user = await this.userModel.findOne({ email });
    return !!user;
  }

  async loginUser(
    loginDTO: LoginDTO,
  ): Promise<{ user: UserDocument; token: string }> {
    const sessionUserData = await this.usersService.findOneByEmail(
      loginDTO.email,
    );

    if (!sessionUserData) {
      throw new BadGatewayException();
    }

    const hash = crypto
      .createHash('sha512')
      .update(loginDTO.password)
      .digest('hex');
    if (hash !== sessionUserData.password) {
      throw new UnauthorizedException('Contraseña inválida');
    }

    const token = await this.getToken({
      email: loginDTO.email,
    });

    if (!token) {
      throw new BadGatewayException('Error al generar el token');
    }
    // Verificar si el usuario está activo
    const { password, ...userWithoutPassword } = sessionUserData;

    return { user: userWithoutPassword as UserDocument, token };
  }

  // Empresa
}
