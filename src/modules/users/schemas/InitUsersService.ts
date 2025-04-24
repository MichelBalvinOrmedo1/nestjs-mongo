import { Injectable, OnModuleInit } from '@nestjs/common';
import { UsersService } from '../users.service';
import { UserStatus } from '../enums/user-status.enum';
import * as crypto from 'crypto';

@Injectable()
export class InitUsersService implements OnModuleInit {
  constructor(private readonly usersService: UsersService) {}

  async onModuleInit() {
    const existingUser =
      await this.usersService.findOneByEmail('admin@hotmail.com');

    const password = 'admin123';
    const hash = crypto.createHash('sha512').update(password).digest('hex');
    if (!existingUser) {
      await this.usersService.createUserDefault({
        nombres: 'ADMINISTRADOR'.toUpperCase(),
        apellidoPaterno: '',
        apellidoMaterno: '',
        telefono: '999999999',
        tipoUsuario: 'ADMINISTRADOR',
        email: 'admin@hotmail.com',
        status: UserStatus.ACTIVE,
        password: hash,
      });
      console.log('Usuario administrador creado exitosamente.');
    } else {
      console.log('El usuario administrador ya existe.');
    }
  }
}
