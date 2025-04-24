import { Controller } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('/usuario')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
}
