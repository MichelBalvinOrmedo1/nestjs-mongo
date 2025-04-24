import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';
import * as crypto from 'crypto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userSessionModel: Model<User>) {}

  async findOneById(id: string): Promise<User> {
    const data = await this.userSessionModel.findById(id).exec();

    return data;
  }

  async findOneByEmail(email: string): Promise<User> {
    const data = await this.userSessionModel.findOne({ email }).exec();
    if (!data) return null;
    return data.toObject();
  }

  async createUser(user) {
    const password = crypto.randomBytes(8).toString('hex'); // Genera una contraseña aleatoria
    const hash = crypto.createHash('sha512').update(password).digest('hex');

    const data = await this.userSessionModel.create({
      ...user,
      password: hash,
    });

    return data;
  }
  async createUserDefault(user) {
    const data = await this.userSessionModel.create(user);

    return data;
  }
}
